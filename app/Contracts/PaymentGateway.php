<?php

namespace App\Contracts;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;

/**
 * Provider adapters implement this contract. Gateway code must verify webhooks
 * before changing payment or booking state and must never handle raw card data.
 */
interface PaymentGateway
{
    /** Create a hosted checkout session and return its redirect URL. */
    public function createCheckout(Booking $booking, Payment $payment): string;

    /** Verify the provider signature and return normalized event data. */
    public function verifyWebhook(Request $request): array;
}
