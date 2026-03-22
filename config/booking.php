<?php

return [
    'timezone' => env('BOOKING_TIMEZONE', env('APP_TIMEZONE', 'Europe/Rome')),
    'slot_granularity_minutes' => (int) env('BOOKING_SLOT_GRANULARITY', 15),
    'buffer_minutes_default' => (int) env('BOOKING_BUFFER_MINUTES', 5),
    'min_advance_minutes' => (int) env('BOOKING_MIN_ADVANCE_MINUTES', 60),
];
