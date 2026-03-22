<?php

use App\Models\Setting;
use App\Models\User;

test('admin can update shop settings through api', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    $response = $this->actingAs($admin)->putJson('/api/admin/settings', [
        'shop_name' => 'Barber Corner',
        'shop_address' => 'Via Torino 10',
        'shop_city' => 'Milano',
        'shop_postal_code' => '20121',
        'shop_phone' => '+39 347 555 0000',
        'shop_email' => 'ciao@barbercorner.test',
        'shop_vat_number' => 'IT00011122233',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.shop_phone', '+39 347 555 0000')
        ->assertJsonPath('data.shop_name', 'Barber Corner');

    expect(Setting::query()->where('key', 'shop_phone')->value('value'))
        ->toBe('+39 347 555 0000');

    $this->getJson('/api/site')
        ->assertOk()
        ->assertJsonPath('data.settings.shop_phone', '+39 347 555 0000')
        ->assertJsonPath('data.settings.shop_name', 'Barber Corner');
});
