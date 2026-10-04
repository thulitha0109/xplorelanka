<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class PaymentCheckoutService
{
    /** Start hosted checkout only after the business has approved a priced booking. */
    public function start(Booking $booking, PaymentGateway $gateway, string $provider): array
    {
        if ($booking->status !== 'confirmed' || ! $booking->quoted_total_minor || ! in_array($booking->currency, ['USD', 'EUR'], true)) {
            throw new RuntimeException('A confirmed booking with a saved USD/EUR quote is required before checkout.');
        }
        if ($booking->payment_status === 'paid') {
            throw new RuntimeException('This booking has already been paid.');
        }

        $payment = $booking->payments()->create([
            'provider' => $provider,
            'idempotency_key' => 'booking-' . $booking->id . '-' . Str::uuid(),
            'amount_minor' => $booking->quoted_total_minor,
            'currency' => $booking->currency,
            'status' => 'pending',
            'metadata' => ['price_snapshot' => $booking->price_snapshot],
        ]);

        try {
            $checkoutUrl = $gateway->createCheckout($booking, $payment);
        } catch (\Throwable $exception) {
            $payment->update(['status' => 'failed']);
            throw $exception;
        }

        return ['payment' => $payment->fresh(), 'checkout_url' => $checkoutUrl];
    }

    /** Call only with normalized event data returned by a verified gateway webhook. */
    public function applyVerifiedEvent(Payment $payment, array $event): Payment
    {
        if (! in_array($event['status'] ?? null, ['paid', 'failed', 'cancelled', 'refunded'], true)) {
            throw new InvalidArgumentException('Unsupported payment event state.');
        }
        if ((int) ($event['amount_minor'] ?? -1) !== (int) $payment->amount_minor
            || strtoupper((string) ($event['currency'] ?? '')) !== $payment->currency) {
            throw new InvalidArgumentException('The gateway amount or currency does not match the saved quote.');
        }

        return DB::transaction(function () use ($payment, $event) {
            $payment = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($payment->status === 'paid') {
                return $payment;
            }

            $payment->update([
                'provider_transaction_id' => $event['transaction_id'] ?? $payment->provider_transaction_id,
                'status' => $event['status'],
                'paid_at' => $event['status'] === 'paid' ? ($event['occurred_at'] ?? now()) : null,
            ]);

            $bookingStatus = match ($event['status']) {
                'paid' => 'paid',
                'failed' => 'failed',
                'cancelled' => 'cancelled',
                'refunded' => 'refunded',
            };
            $payment->booking()->lockForUpdate()->firstOrFail()->update(['payment_status' => $bookingStatus]);

            return $payment->fresh();
        });
    }
}
