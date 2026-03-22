<?php

namespace Database\Seeders;

use App\Models\OpeningHour;
use Illuminate\Database\Seeder;

class OpeningHoursSeeder extends Seeder
{
    public function run(): void
    {
        $hours = [
            ['weekday' => 1, 'start_time' => '09:00', 'end_time' => '19:30'],
            ['weekday' => 2, 'start_time' => '09:00', 'end_time' => '19:30'],
            ['weekday' => 3, 'start_time' => '09:00', 'end_time' => '19:30'],
            ['weekday' => 4, 'start_time' => '09:00', 'end_time' => '19:30'],
            ['weekday' => 5, 'start_time' => '09:00', 'end_time' => '19:30'],
            ['weekday' => 6, 'start_time' => '09:00', 'end_time' => '18:00'],
        ];

        OpeningHour::query()->delete();
        OpeningHour::query()->insert($hours);
    }
}
