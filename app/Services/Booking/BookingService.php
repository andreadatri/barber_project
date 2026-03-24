<?php

namespace App\Services\Booking;

use App\Exceptions\BookingConflictException;
use App\Models\Appointment;
use App\Models\Service;
use App\Services\Availability\AvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(private readonly AvailabilityService $availability)
    {
    }

    public function createFromDraft(array $draft): Appointment
    {
        $timezone = config('booking.timezone');
        $service = Service::query()->findOrFail($draft['service_id']);
        $startAt = CarbonImmutable::createFromFormat('Y-m-d H:i', "{$draft['date']} {$draft['time']}", $timezone);
        $endAt = $startAt->addMinutes($service->duration_minutes + (int) config('booking.buffer_minutes_default'));
        $slotStillAvailable = $this->availability
            ->slotsForDate($service, $startAt->startOfDay())
            ->contains(fn (CarbonImmutable $slot) => $slot->equalTo($startAt));

        if (! $slotStillAvailable) {
            throw new BookingConflictException('Selected slot is not bookable.');
        }

        return DB::transaction(function () use ($draft, $service, $startAt, $endAt) {
            $conflict = Appointment::query()
                ->where('status', 'booked')
                ->whereBetween('start_at', [$startAt->startOfDay()->utc(), $startAt->endOfDay()->utc()])
                ->lockForUpdate()
                ->get()
                ->contains(function (Appointment $appointment) use ($startAt, $endAt) {
                    $appointmentStart = $appointment->start_at->toImmutable();
                    $appointmentEnd = $appointment->end_at->toImmutable();

                    return $startAt->lt($appointmentEnd) && $endAt->gt($appointmentStart);
                });

            if ($conflict) {
                throw new BookingConflictException('Selected slot is no longer available.');
            }

            return Appointment::query()->create([
                'service_id' => $service->id,
                'start_at' => $startAt->utc(),
                'end_at' => $endAt->utc(),
                'customer_name' => $draft['customer_name'],
                'customer_phone' => $draft['customer_phone'],
                'customer_email' => $draft['customer_email'] ?? null,
                'notes' => $draft['notes'] ?? null,
                'status' => 'booked',
            ]);
        });
    }
}
