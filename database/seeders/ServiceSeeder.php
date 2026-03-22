<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Taglio classico', 'duration_minutes' => 30, 'price_cents' => 2500],
            ['name' => 'Taglio + barba', 'duration_minutes' => 45, 'price_cents' => 3500],
            ['name' => 'Solo barba', 'duration_minutes' => 20, 'price_cents' => 1500],
            ['name' => 'Taglio bambino', 'duration_minutes' => 20, 'price_cents' => 1800],
            ['name' => 'Rasatura tradizionale', 'duration_minutes' => 30, 'price_cents' => 2000],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['name' => $service['name']],
                $service + ['active' => true],
            );
        }
    }
}
