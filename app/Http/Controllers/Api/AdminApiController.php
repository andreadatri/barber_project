<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminApiController extends Controller
{
    public function settings(): JsonResponse
    {
        return response()->json([
            'data' => Setting::getMany($this->settingDefaults()),
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
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

        return response()->json([
            'data' => Setting::getMany($this->settingDefaults()),
            'message' => 'Impostazioni aggiornate.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
        ]);
    }

    public function appointments(): JsonResponse
    {
        $appointments = Appointment::query()
            ->with('service')
            ->orderBy('start_at')
            ->get()
            ->map(fn (Appointment $appointment) => $this->mapAppointment($appointment));

        return response()->json([
            'data' => $appointments,
        ]);
    }

    public function updateAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:booked,completed,cancelled'],
        ]);

        $appointment->forceFill([
            'status' => $data['status'],
        ])->save();

        $appointment->load('service');

        return response()->json([
            'data' => $this->mapAppointment($appointment),
            'message' => 'Appuntamento aggiornato.',
        ]);
    }

    private function settingDefaults(): array
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

    private function mapAppointment(Appointment $appointment): array
    {
        return [
            'id' => $appointment->id,
            'status' => $appointment->status,
            'customer_name' => $appointment->customer_name,
            'customer_phone' => $appointment->customer_phone,
            'customer_email' => $appointment->customer_email,
            'notes' => $appointment->notes,
            'start_at' => $appointment->start_at->toIso8601String(),
            'end_at' => $appointment->end_at->toIso8601String(),
            'service' => [
                'id' => $appointment->service->id,
                'name' => $appointment->service->name,
                'duration' => $appointment->service->duration_minutes,
                'price' => round($appointment->service->price_cents / 100, 2),
            ],
        ];
    }
}
