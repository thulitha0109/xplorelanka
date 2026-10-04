<?php

namespace Tests\Unit;

use App\Services\CurrencyPreferenceService;
use Illuminate\Http\Request;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Tests\TestCase;

class CurrencyPreferenceServiceTest extends TestCase
{
    public function test_euro_area_locale_defaults_to_eur_and_other_regions_to_usd(): void
    {
        $service = new CurrencyPreferenceService();

        $euroRequest = Request::create('/', 'GET', [], [], [], ['HTTP_ACCEPT_LANGUAGE' => 'de-DE,de;q=0.9']);
        $euroRequest->setLaravelSession(new Store('test', new ArraySessionHandler(120)));
        $this->assertSame('EUR', $service->defaultCurrency($euroRequest));
        $this->assertSame('DE', $service->countryCode($euroRequest));

        $otherRequest = Request::create('/', 'GET', [], [], [], ['HTTP_ACCEPT_LANGUAGE' => 'en-US,en;q=0.9']);
        $otherRequest->setLaravelSession(new Store('test', new ArraySessionHandler(120)));
        $this->assertSame('USD', $service->defaultCurrency($otherRequest));
    }

    public function test_explicit_currency_preference_is_kept_across_requests(): void
    {
        $request = Request::create('/', 'GET');
        $session = new Store('test', new ArraySessionHandler(120));
        $session->put('currency', 'EUR');
        $request->setLaravelSession($session);

        $this->assertSame('EUR', (new CurrencyPreferenceService())->defaultCurrency($request));
    }
}
