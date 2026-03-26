<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Closure;
use App\Models\OpeningHour;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        $settings = Setting::getMany($this->shopDefaults());

        return view('pages.public.home', [
            'services' => Service::query()->where('active', true)->orderBy('price_cents')->get(),
            'openingHours' => OpeningHour::query()->orderBy('weekday')->get(),
            'settings' => $settings,
            'phoneHref' => $this->phoneHref($settings['shop_phone']),
        ]);
    }

    public function privacy(): View
    {
        return view('pages.public.privacy');
    }

    public function terms(): View
    {
        return view('pages.public.terms');
    }

    public function adminLogin(): View
    {
        return view('pages.admin.auth.login');
    }

    public function adminDashboard(): View
    {
        return view('pages.admin.dashboard', [
            'serviceCount' => Service::query()->count(),
            'appointmentCount' => Appointment::query()->count(),
            'closureCount' => Closure::query()->count(),
            'upcomingAppointments' => Appointment::query()->with('service')->latest('start_at')->take(5)->get(),
        ]);
    }

    public function adminServices(): View
    {
        return view('pages.admin.services.index', [
            'services' => Service::query()->orderBy('name')->get(),
        ]);
    }

    public function adminAppointments(): View
    {
        return view('pages.admin.appointments.index', [
            'appointments' => Appointment::query()->with('service')->latest('start_at')->take(12)->get(),
        ]);
    }

    public function adminAvailability(): View
    {
        return view('pages.admin.settings.availability', [
            'openingHours' => OpeningHour::query()->orderBy('weekday')->get(),
        ]);
    }

    public function adminClosures(): View
    {
        return view('pages.admin.settings.closures', [
            'closures' => Closure::query()->latest('start_at')->get(),
        ]);
    }

    private function shopDefaults(): array
    {
        return [
            'shop_name' => 'Essenza del Barbiere',
            'shop_address' => 'Via Roma 123',
            'shop_city' => 'Milano',
            'shop_postal_code' => '20100',
            'shop_phone' => '+39 333 123 4567',
            'shop_email' => 'info@ilbarbiere.it',
            'shop_vat_number' => 'IT12345678901',
        ];
    }

    private function phoneHref(string $phone): string
    {
        $normalized = preg_replace('/(?!^\+)[^\d]/', '', $phone) ?? $phone;

        return 'tel:'.$normalized;
    }
}
