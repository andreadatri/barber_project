<?php

namespace App\Services\Availability;

use App\Models\Appointment;
use App\Models\Closure;
use App\Models\OpeningHour;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class AvailabilityService
{
    public function __construct(private readonly SlotGenerator $slotGenerator)
    {
    }

    public function availableDates(Service $service, int $days = 10): Collection
    {
        $timezone = config('booking.timezone');
        $start = CarbonImmutable::now($timezone)->startOfDay();

        return collect(range(0, $days - 1))
            ->map(fn (int $offset) => $start->addDays($offset))
            ->filter(fn (CarbonImmutable $date) => $this->slotsForDate($service, $date)->isNotEmpty())
            ->values();
    }

    public function slotsForDate(Service $service, CarbonImmutable $date): Collection
    {
        $openingHours = OpeningHour::query()
            ->where('weekday', $date->dayOfWeek)
            ->orderBy('start_time')
            ->get();

        if ($openingHours->isEmpty()) {
            return collect();
        }

        $appointments = Appointment::query()
            ->where('status', 'booked')
            ->whereBetween('start_at', [
                $date->startOfDay()->utc(),
                $date->endOfDay()->utc(),
            ])
            ->get()
            ->map(fn (Appointment $appointment) => [
                'start' => $appointment->start_at->setTimezone($date->timezone),
                'end' => $appointment->end_at->setTimezone($date->timezone),
            ]);

        $closures = Closure::query()
            ->where('start_at', '<', $date->endOfDay()->utc())
            ->where('end_at', '>', $date->startOfDay()->utc())
            ->get()
            ->map(fn (Closure $closure) => [
                'start' => $closure->start_at->setTimezone($date->timezone),
                'end' => $closure->end_at->setTimezone($date->timezone),
            ]);

        $buffer = (int) config('booking.buffer_minutes_default');
        $granularity = (int) config('booking.slot_granularity_minutes');
        $advance = (int) config('booking.min_advance_minutes');

        return $openingHours
            ->flatMap(function (OpeningHour $hours) use ($appointments, $closures, $service, $date, $granularity, $advance, $buffer) {
                $windowStart = $date->setTimeFromTimeString($hours->start_time);
                $windowEnd = $date->setTimeFromTimeString($hours->end_time);

                return $this->slotGenerator
                    ->generate($windowStart, $windowEnd, $service->duration_minutes + $buffer, $granularity, $advance)
                    ->reject(function (CarbonImmutable $slot) use ($service, $appointments, $closures, $buffer) {
                        $end = $slot->addMinutes($service->duration_minutes + $buffer);

                        $overlapsAppointment = $appointments->contains(
                            fn (array $busy) => $slot->lt($busy['end']) && $end->gt($busy['start']),
                        );
                        $overlapsClosure = $closures->contains(
                            fn (array $busy) => $slot->lt($busy['end']) && $end->gt($busy['start']),
                        );

                        return $overlapsAppointment || $overlapsClosure;
                    });
            })
            ->values();
    }
}
