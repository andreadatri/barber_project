<?php

namespace App\Services\Booking;

use App\Models\Service;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Str;

class BookingDraftService
{
    public const SESSION_KEY = 'booking.draft';

    public function __construct(private readonly Session $session)
    {
    }

    public function all(): array
    {
        return $this->session->get(self::SESSION_KEY, []);
    }

    public function put(array $values): array
    {
        $draft = array_merge($this->all(), $values);
        $this->session->put(self::SESSION_KEY, $draft);

        return $draft;
    }

    public function resetAfter(string $step): array
    {
        $draft = match ($step) {
            'service' => [],
            'date' => array_intersect_key($this->all(), array_flip(['service_id'])),
            'time' => array_intersect_key($this->all(), array_flip(['service_id', 'date'])),
            'contact' => array_intersect_key($this->all(), array_flip(['service_id', 'date', 'time'])),
            default => $this->all(),
        };

        unset($draft['submit_token']);
        $this->session->put(self::SESSION_KEY, $draft);

        return $draft;
    }

    public function ensureToken(): string
    {
        $draft = $this->all();
        $token = $draft['submit_token'] ?? Str::uuid()->toString();
        $draft['submit_token'] = $token;
        $this->session->put(self::SESSION_KEY, $draft);

        return $token;
    }

    public function selectedService(): ?Service
    {
        $serviceId = $this->all()['service_id'] ?? null;

        return $serviceId ? Service::query()->find($serviceId) : null;
    }

    public function clear(): void
    {
        $this->session->forget(self::SESSION_KEY);
    }
}
