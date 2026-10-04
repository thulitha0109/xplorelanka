<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Accommodation;
use App\Models\CampingLocation;
use App\Models\Partner;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Services\CatalogPricingService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('catalog:sync-currency-prices', function (CatalogPricingService $pricing) {
    $count = 0;

    foreach ([Tour::class, Accommodation::class, Vehicle::class, CampingLocation::class, Partner::class] as $modelClass) {
        $modelClass::query()->each(function ($model) use ($pricing, &$count) {
            $pricing->syncFromModel($model);
            $count++;
        });
    }

    $this->info("Synchronized USD/EUR catalog prices for {$count} catalog records.");
})->purpose('Refresh FX-generated catalog prices while preserving manually maintained USD/EUR prices');
