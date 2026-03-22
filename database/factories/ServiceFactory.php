<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'duration_minutes' => fake()->randomElement([20, 30, 45]),
            'price_cents' => fake()->randomElement([1500, 2000, 2500, 3500]),
            'active' => true,
        ];
    }
}
