<?php

namespace App\Services;

use App\Models\Accommodation;
use App\Models\CampingLocation;
use App\Models\CatalogPrice;
use App\Models\Partner;
use App\Models\Tour;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;

class CatalogPricingService
{
    /**
     * Prices live in the catalog in minor units. USD is the fallback source for
     * imported tour prices; legacy LKR-only prices are converted once and saved.
     * EUR values are also persisted, so checkout never depends on browser FX.
     *
     * @param array<string, array{lkr?:?float, usd?:?float, eur?:?float}> $units
     */
    public function sync(Model $priceable, array $units): void
    {
        $usdToEur = (float) config('currency.rates.USD_EUR', 0.92);
        $lkrPerUsd = (float) config('currency.rates.USD_LKR', 300);

        foreach ($units as $unit => $amounts) {
            $lkr = $this->positiveOrNull($amounts['lkr'] ?? null);
            $usd = $this->positiveOrNull($amounts['usd'] ?? null);
            $eur = $this->positiveOrNull($amounts['eur'] ?? null);

            if ($usd === null && $lkr !== null && $lkrPerUsd > 0) {
                $usd = $lkr / $lkrPerUsd;
            }
            if ($eur === null && $usd !== null && $usdToEur > 0) {
                $eur = $usd * $usdToEur;
            }

            foreach (['USD' => $usd, 'EUR' => $eur] as $currency => $amount) {
                if ($amount === null) {
                    continue;
                }

                $sourceCurrency = $currency === 'EUR' && ($amounts['eur'] ?? null) !== null
                    ? 'EUR'
                    : ($currency === 'USD' && ($amounts['usd'] ?? null) !== null ? 'USD' : ($lkr !== null && ($amounts['usd'] ?? null) === null ? 'LKR' : 'USD'));
                $sourceAmount = $sourceCurrency === 'LKR' ? $lkr : ($sourceCurrency === 'EUR' ? $eur : $usd);
                $rate = match ($sourceCurrency . '-' . $currency) {
                    'LKR-USD' => 1 / max($lkrPerUsd, 0.000001),
                    'USD-EUR' => $usdToEur,
                    default => 1,
                };

                $priceable->catalogPrices()->updateOrCreate(
                    [
                        'unit' => $unit,
                        'currency' => $currency,
                    ],
                    [
                        'amount_minor' => (int) round($amount * 100),
                        'source_currency' => $sourceCurrency,
                        'source_amount' => $sourceAmount,
                        'exchange_rate' => $rate,
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    public function syncFromModel(Model $model): void
    {
        if ($model instanceof Tour) {
            $this->sync($model, ['package' => ['lkr' => $model->price_lkr, 'usd' => $model->price_usd] + $this->directOverrides($model, 'package')]);
        } elseif ($model instanceof Accommodation) {
            $this->sync($model, ['night' => ['lkr' => $model->price_lkr] + $this->directOverrides($model, 'night')]);
        } elseif ($model instanceof Vehicle) {
            $perKmLkr = $this->numberFromRate($model->rate_per_km);
            $this->sync($model, [
                'per_km' => ['lkr' => $perKmLkr] + $this->directOverrides($model, 'per_km'),
                'day' => ['lkr' => $model->daily_rate_lkr] + $this->directOverrides($model, 'day'),
                'base' => ['lkr' => $model->base_rate_lkr] + $this->directOverrides($model, 'base'),
            ]);
        } elseif ($model instanceof CampingLocation) {
            $this->sync($model, ['experience' => ['lkr' => $model->starting_price_lkr] + $this->directOverrides($model, 'experience')]);
        } elseif ($model instanceof Partner) {
            $this->sync($model, ['partner_rate' => ['lkr' => $model->rate_lkr] + $this->directOverrides($model, 'partner_rate')]);
        }
    }

    /** Keep explicitly administered currency prices intact during FX resyncs. */
    private function directOverrides(Model $priceable, string $unit): array
    {
        return $priceable->catalogPrices()
            ->where('unit', $unit)
            ->whereIn('source_currency', ['USD', 'EUR'])
            ->get()
            ->mapWithKeys(fn (CatalogPrice $price) => [strtolower($price->currency) => $price->amount_minor / 100])
            ->all();
    }

    private function positiveOrNull(mixed $value): ?float
    {
        if ($value === null || $value === '' || ! is_numeric($value) || (float) $value <= 0) {
            return null;
        }

        return (float) $value;
    }

    private function numberFromRate(?string $rate): ?float
    {
        if (! $rate || ! preg_match('/\d+(?:\.\d+)?/', $rate, $matches)) {
            return null;
        }

        return (float) $matches[0];
    }
}
