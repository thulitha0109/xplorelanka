<?php

namespace App\Services;

use Illuminate\Http\Request;

class CurrencyPreferenceService
{
    public function defaultCurrency(Request $request): string
    {
        $saved = $request->session()->get('currency');
        if (in_array($saved, config('currency.supported', ['USD', 'EUR']), true)) {
            return $saved;
        }

        $languages = $request->getLanguages();
        foreach ($languages as $language) {
            if (preg_match('/^[a-z]{2,3}[-_]([A-Z]{2})\b/', $language, $matches)
                && in_array($matches[1], config('currency.euro_countries', []), true)) {
                return 'EUR';
            }
        }

        return 'USD';
    }

    public function countryCode(Request $request): ?string
    {
        $country = strtoupper((string) $request->session()->get('country_code', ''));
        if (preg_match('/^[A-Z]{2}$/', $country)) {
            return $country;
        }

        foreach ($request->getLanguages() as $language) {
            if (preg_match('/^[a-z]{2,3}[-_]([A-Z]{2})\b/', $language, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }
}
