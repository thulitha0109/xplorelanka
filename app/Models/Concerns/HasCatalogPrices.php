<?php

namespace App\Models\Concerns;

use App\Models\CatalogPrice;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasCatalogPrices
{
    public function catalogPrices(): MorphMany
    {
        return $this->morphMany(CatalogPrice::class, 'priceable');
    }

    /** @return array<string, array<string, array{amount_minor:int, amount:float, currency:string, unit:string}>> */
    public function getPricesAttribute(): array
    {
        $this->loadMissing('catalogPrices');

        return $this->catalogPrices
            ->where('is_active', true)
            ->groupBy('unit')
            ->map(fn ($unitPrices) => $unitPrices->keyBy('currency')->map(fn (CatalogPrice $price) => [
                'amount_minor' => (int) $price->amount_minor,
                'amount' => $price->amount_minor / 100,
                'currency' => $price->currency,
                'unit' => $price->unit,
            ]))
            ->all();
    }

    public function toArray(): array
    {
        return [...parent::toArray(), 'prices' => $this->prices];
    }
}
