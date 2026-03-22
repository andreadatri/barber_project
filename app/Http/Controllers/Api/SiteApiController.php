<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OpeningHour;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SiteApiController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = Setting::getMany($this->defaults());

        $openingHours = OpeningHour::query()
            ->orderBy('weekday')
            ->get()
            ->map(fn (OpeningHour $hours) => [
                'weekday' => $hours->weekday,
                'start_time' => substr($hours->start_time, 0, 5),
                'end_time' => substr($hours->end_time, 0, 5),
            ]);

        return response()->json([
            'data' => [
                'settings' => $settings,
                'opening_hours' => $openingHours,
            ],
        ]);
    }

    private function defaults(): array
    {
        return [
            'shop_name' => 'Il Barbiere',
            'shop_address' => 'Via Roma 123',
            'shop_city' => 'Milano',
            'shop_postal_code' => '20100',
            'shop_phone' => '+39 333 123 4567',
            'shop_email' => 'info@ilbarbiere.it',
            'shop_vat_number' => 'IT12345678901',
        ];
    }
}
