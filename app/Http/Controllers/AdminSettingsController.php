<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminSettingsController extends Controller
{
    public function edit(): View
    {
        return view('pages.admin.settings.general', [
            'settings' => Setting::getMany($this->defaults()),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'shop_name' => ['required', 'string', 'max:255'],
            'shop_address' => ['required', 'string', 'max:255'],
            'shop_city' => ['required', 'string', 'max:255'],
            'shop_postal_code' => ['required', 'string', 'max:20'],
            'shop_phone' => ['required', 'string', 'max:50'],
            'shop_email' => ['required', 'string', 'email', 'max:255'],
            'shop_vat_number' => ['nullable', 'string', 'max:50'],
        ]);

        Setting::putMany($data);

        return redirect()
            ->route('admin.settings.general')
            ->with('success', 'Impostazioni aggiornate.');
    }
    // TODO: add more settings sections (e.g. opening hours, services, etc.)
    private function defaults(): array
    {
        return [
            'shop_name' => 'Essenza del Barbiere',
            'shop_address' => 'Via Roma 123',
            'shop_city' => 'Milano',
            'shop_postal_code' => '20100',
            'shop_phone' => '+39 333 123 4567',
            'shop_email' => 'info@essenzadelbarbiere.it',
            'shop_vat_number' => 'IT12345678901',
        ];
    }
}
