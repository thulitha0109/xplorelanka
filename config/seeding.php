<?php

return [
    'admin_email' => env('SEED_ADMIN_EMAIL', 'admin@xplorelanka.com'),
    'admin_password' => env('SEED_ADMIN_PASSWORD', env('APP_ENV') === 'local' ? 'password' : null),
];
