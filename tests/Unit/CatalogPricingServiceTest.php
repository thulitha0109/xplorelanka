<?php

namespace Tests\Unit;

use App\Models\CatalogPrice;
use App\Models\Tour;
use App\Services\CatalogPricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogPricingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_persists_minor_unit_usd_and_eur_prices_from_lkr(): void
    {
        config(['currency.rates.USD_LKR' => 300, 'currency.rates.USD_EUR' => 0.90]);
        $tour = Tour::create([
            'title' => 'Test tour',
            'slug' => 'test-tour',
            'category' => 'cultural',
            'route' => 'Kandy - Ella',
            'duration' => '3 days',
            'price_lkr' => 30000,
        ]);

        app(CatalogPricingService::class)->syncFromModel($tour);

        $this->assertDatabaseHas('catalog_prices', [
            'priceable_type' => Tour::class,
            'priceable_id' => $tour->id,
            'unit' => 'package',
            'currency' => 'USD',
            'amount_minor' => 10000,
        ]);
        $this->assertDatabaseHas('catalog_prices', [
            'priceable_type' => Tour::class,
            'priceable_id' => $tour->id,
            'unit' => 'package',
            'currency' => 'EUR',
            'amount_minor' => 9000,
        ]);
    }

    public function test_explicit_currency_prices_override_conversion_fallbacks(): void
    {
        config(['currency.rates.USD_LKR' => 300, 'currency.rates.USD_EUR' => 0.90]);
        $tour = Tour::create([
            'title' => 'Direct-price tour',
            'slug' => 'direct-price-tour',
            'category' => 'cultural',
            'route' => 'Kandy - Ella',
            'duration' => '3 days',
            'price_lkr' => 30000,
        ]);

        app(CatalogPricingService::class)->sync($tour, [
            'package' => ['lkr' => 30000, 'usd' => 125, 'eur' => 110],
        ]);

        $this->assertSame(12500, CatalogPrice::where('priceable_id', $tour->id)->where('currency', 'USD')->value('amount_minor'));
        $this->assertSame(11000, CatalogPrice::where('priceable_id', $tour->id)->where('currency', 'EUR')->value('amount_minor'));
    }
}
