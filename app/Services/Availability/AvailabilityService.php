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
            ->filter(fn (CarbonImmutable $date) => $this->slotStatusesForDate($service, $date)->contains('available', true))
            ->values();
    }

    public function slotsForDate(Service $service, CarbonImmutable $date): Collection
    {
        return $this->slotStatusesForDate($service, $date)
            ->filter(fn (array $slot) => $slot['available'])
            ->pluck('time')
            ->values();
    }

    public function slotStatusesForDate(Service $service, CarbonImmutable $date): Collection
    {
        $openingHours = $this->openingHoursForDate($date);

        if ($openingHours->isEmpty()) {
            return collect();
        }

        $appointments = $this->appointmentsForDate($date);
        $closures = $this->closuresForDate($date);

        $buffer = (int) config('booking.buffer_minutes_default');
        $granularity = (int) config('booking.slot_granularity_minutes');
        $advance = (int) config('booking.min_advance_minutes');
        $duration = $service->duration_minutes + $buffer;
        $threshold = CarbonImmutable::now($date->timezone)->addMinutes($advance);

        return $openingHours
            ->flatMap(function (OpeningHour $hours) use ($appointments, $closures, $service, $date, $duration, $granularity, $advance, $threshold) {
                $windowStart = $date->setTimeFromTimeString($hours->start_time);
                $windowEnd = $date->setTimeFromTimeString($hours->end_time);

                return $this->slotGenerator
                    ->generate($windowStart, $windowEnd, $duration, $granularity, $advance, false)
                    ->map(function (CarbonImmutable $slot) use ($appointments, $closures, $duration, $threshold) {
                        $reason = $this->unavailableReason($slot, $duration, $threshold, $appointments, $closures);

                        return [
                            'time' => $slot,
                            'available' => $reason === null,
                            'reason' => $reason,
                        ];
                    });
            })
            ->values();
    }

    private function openingHoursForDate(CarbonImmutable $date): Collection
    {
        return OpeningHour::query()
            ->where('weekday', $date->dayOfWeek)
            ->orderBy('start_time')
            ->get();
    }

    private function appointmentsForDate(CarbonImmutable $date): Collection
    {
        return Appointment::query()
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
    }

    private function closuresForDate(CarbonImmutable $date): Collection
    {
        return Closure::query()
            ->where('start_at', '<', $date->endOfDay()->utc())
            ->where('end_at', '>', $date->startOfDay()->utc())
            ->get()
            ->map(fn (Closure $closure) => [
                'start' => $closure->start_at->setTimezone($date->timezone),
                'end' => $closure->end_at->setTimezone($date->timezone),
            ]);
    }

    private function unavailableReason(
        CarbonImmutable $slot,
        int $durationMinutes,
        CarbonImmutable $threshold,
        Collection $appointments,
        Collection $closures,
    ): ?string {
        $end = $slot->addMinutes($durationMinutes);

        if ($slot->lt($threshold)) {
            return 'Richiede più anticipo.';
        }

        $overlapsAppointment = $appointments->contains(
            fn (array $busy) => $slot->lt($busy['end']) && $end->gt($busy['start']),
        );

        if ($overlapsAppointment) {
            return 'Orario già occupato.';
        }

        $overlapsClosure = $closures->contains(
            fn (array $busy) => $slot->lt($busy['end']) && $end->gt($busy['start']),
        );

        if ($overlapsClosure) {
            return 'Orario non prenotabile.';
        }

        return null;
    }
}
