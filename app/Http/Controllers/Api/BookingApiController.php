<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BookingConflictException;
use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\Availability\AvailabilityService;
use App\Services\Booking\BookingService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingApiController extends Controller
{
    public function __construct(
        private readonly AvailabilityService $availability,
        private readonly BookingService $bookings,
    ) {
    }

    public function services(): JsonResponse
    {
        $services = Service::query()
            ->where('active', true)
            ->orderBy('price_cents')
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'duration' => $service->duration_minutes,
                'price' => round($service->price_cents / 100, 2),
                'price_cents' => $service->price_cents,
                'description' => "{$service->duration_minutes} minuti di servizio.",
            ]);

        return response()->json([
            'data' => $services,
        ]);
    }

    public function availability(Request $request): JsonResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'date' => ['required', 'date_format:Y-m-d'],
        ]);

        $service = Service::query()->findOrFail($data['service_id']);
        $date = CarbonImmutable::createFromFormat('Y-m-d', $data['date'], config('booking.timezone'));
        $slots = $this->availability->slotStatusesForDate($service, $date);

        return response()->json([
            'data' => [
                'date' => $date->format('Y-m-d'),
                'slots' => $slots->map(fn (array $slot) => [
                    'time' => $slot['time']->format('H:i'),
                    'available' => $slot['available'],
                    'reason' => $slot['reason'],
                ])->values(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'date' => ['required', 'date_format:Y-m-d'],
            'time' => ['required', 'date_format:H:i'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $appointment = $this->bookings->createFromDraft($data);
        } catch (BookingConflictException) {
            return response()->json([
                'message' => 'Lo slot selezionato non è più disponibile.',
            ], 409);
        }

        $appointment->load('service');

        return response()->json([
            'data' => [
                'id' => $appointment->id,
                'status' => $appointment->status,
                'service' => [
                    'id' => $appointment->service->id,
                    'name' => $appointment->service->name,
                    'duration' => $appointment->service->duration_minutes,
                    'price' => round($appointment->service->price_cents / 100, 2),
                ],
                'customer' => [
                    'name' => $appointment->customer_name,
                    'phone' => $appointment->customer_phone,
                    'email' => $appointment->customer_email,
                    'notes' => $appointment->notes,
                ],
                'start_at' => $appointment->start_at->toIso8601String(),
                'end_at' => $appointment->end_at->toIso8601String(),
            ],
        ], 201);
    }
}
