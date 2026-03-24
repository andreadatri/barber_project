<?php

use App\Models\Appointment;
use App\Models\OpeningHour;
use App\Models\Service;
use Carbon\CarbonImmutable;

afterEach(fn () => CarbonImmutable::setTestNow());

it('returns slot statuses including unavailable times', function () {
    $timezone = config('booking.timezone');

    CarbonImmutable::setTestNow(CarbonImmutable::create(2026, 4, 5, 8, 0, 0, $timezone));

    $service = Service::factory()->create([
        'duration_minutes' => 30,
        'active' => true,
    ]);

    OpeningHour::query()->create([
        'weekday' => 1,
        'start_time' => '09:00',
        'end_time' => '11:00',
    ]);

    $busyStart = CarbonImmutable::create(2026, 4, 6, 9, 0, 0, $timezone);

    Appointment::query()->create([
        'service_id' => $service->id,
        'start_at' => $busyStart->utc(),
        'end_at' => $busyStart->addMinutes(35)->utc(),
        'customer_name' => 'Mario Rossi',
        'customer_phone' => '3331234567',
        'status' => 'booked',
    ]);

    $response = $this->getJson("/api/availability?service_id={$service->id}&date=2026-04-06");

    $response
        ->assertOk()
        ->assertJsonPath('data.date', '2026-04-06')
        ->assertJsonPath('data.slots.0.time', '09:00')
        ->assertJsonPath('data.slots.0.available', false)
        ->assertJsonPath('data.slots.0.reason', 'Orario già occupato.');

    expect(collect($response->json('data.slots'))->contains(fn (array $slot) => $slot['available'] === true))->toBeTrue();
});

it('rejects bookings for times outside the available slots', function () {
    $service = Service::factory()->create([
        'duration_minutes' => 30,
        'active' => true,
    ]);

    OpeningHour::query()->create([
        'weekday' => 1,
        'start_time' => '09:00',
        'end_time' => '12:00',
    ]);

    $response = $this->postJson('/api/bookings', [
        'service_id' => $service->id,
        'date' => '2026-04-06',
        'time' => '08:00',
        'customer_name' => 'Mario Rossi',
        'customer_phone' => '3331234567',
    ]);

    $response
        ->assertStatus(409)
        ->assertJsonPath('message', 'Lo slot selezionato non è più disponibile.');

    $this->assertDatabaseCount('appointments', 0);
});
