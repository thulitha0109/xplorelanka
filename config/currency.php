<?php

return [
    'supported' => ['USD', 'EUR'],

    // EUR per USD and LKR per USD are configurable reference rates used only
    // to bootstrap or refresh catalog prices; displayed/quoted prices are saved.
    'rates' => [
        'USD_EUR' => (float) env('FX_USD_TO_EUR', 0.92),
        'USD_LKR' => (float) env('FX_USD_TO_LKR', 300),
    ],

    'euro_countries' => [
        'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT',
        'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK',
    ],
];
