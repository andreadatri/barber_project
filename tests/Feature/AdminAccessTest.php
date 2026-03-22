<?php

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin user seeder creates a single admin user', function () {
    $this->seed(AdminUserSeeder::class);
    $this->seed(AdminUserSeeder::class);

    $this->assertDatabaseCount('users', 1);
    $this->assertDatabaseHas('users', [
        'email' => 'admin@example.com',
        'is_admin' => true,
    ]);
});

test('guests are redirected to login for admin spa', function () {
    $response = $this->get('/admin');

    $response->assertRedirect(route('login'));
});

test('non admin users cannot access admin spa', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertForbidden();
});

test('admin users can access admin spa', function () {
    $user = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertOk();
});

test('admin appointments api returns saved appointments', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $service = Service::factory()->create([
        'name' => 'Taglio classico',
        'duration_minutes' => 30,
        'price_cents' => 2500,
    ]);

    Appointment::query()->create([
        'service_id' => $service->id,
        'start_at' => now()->addDay(),
        'end_at' => now()->addDay()->addMinutes(35),
        'customer_name' => 'Mario Rossi',
        'customer_phone' => '+39 333 1234567',
        'customer_email' => 'mario@example.com',
        'notes' => 'Note test',
        'status' => 'booked',
    ]);

    $response = $this->actingAs($user)->getJson('/api/admin/appointments');

    $response
        ->assertOk()
        ->assertJsonPath('data.0.customer_name', 'Mario Rossi')
        ->assertJsonPath('data.0.service.name', 'Taglio classico');
});

test('non admin users cannot access admin appointments api', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->getJson('/api/admin/appointments');

    $response->assertForbidden();
});
