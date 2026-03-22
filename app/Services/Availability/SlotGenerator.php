<?php

namespace App\Services\Availability;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class SlotGenerator
{
    public function generate(
        CarbonInterface $windowStart,
        CarbonInterface $windowEnd,
        int $serviceDurationMinutes,
        int $granularityMinutes,
        int $minAdvanceMinutes,
    ): Collection {
        $start = CarbonImmutable::instance($windowStart instanceof CarbonImmutable ? $windowStart : $windowStart->copy())
            ->ceilMinutes($granularityMinutes);
        $lastStart = CarbonImmutable::instance($windowEnd instanceof CarbonImmutable ? $windowEnd : $windowEnd->copy())
            ->subMinutes($serviceDurationMinutes);
        $threshold = CarbonImmutable::now($windowStart->getTimezone())->addMinutes($minAdvanceMinutes);

        if ($start->greaterThan($lastStart)) {
            return collect();
        }

        return collect(CarbonPeriod::since($start)->minutes($granularityMinutes)->until($lastStart))
            ->map(fn (CarbonInterface $slot) => CarbonImmutable::instance($slot))
            ->filter(fn (CarbonImmutable $slot) => $slot->greaterThanOrEqualTo($threshold))
            ->values();
    }
}
