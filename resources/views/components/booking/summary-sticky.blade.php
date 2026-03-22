@props(['service' => null, 'draft' => []])

<aside class="surface-card p-5 lg:sticky lg:top-24">
    <h3 class="text-base font-semibold">Riepilogo prenotazione</h3>
    <div class="mt-4 space-y-3 text-sm">
        <div>
            <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Servizio</p>
            <p class="mt-1 font-medium">{{ $service?->name ?? 'Da selezionare' }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Durata</p>
                <p class="mt-1 font-medium">{{ $service?->duration_minutes ? "{$service->duration_minutes} min" : '...' }}</p>
            </div>
            <div>
                <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Prezzo</p>
                <p class="mt-1 font-medium">{{ $service ? number_format($service->price_cents / 100, 2, ',', '.') . ' €' : '...' }}</p>
            </div>
        </div>
        <div>
            <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Quando</p>
            <p class="mt-1 font-medium">
                @if (!empty($draft['date']) && !empty($draft['time']))
                    {{ \Carbon\CarbonImmutable::createFromFormat('Y-m-d H:i', "{$draft['date']} {$draft['time']}", config('booking.timezone'))->isoFormat('dddd D MMMM YYYY [alle] HH:mm') }}
                @elseif (!empty($draft['date']))
                    {{ \Carbon\CarbonImmutable::createFromFormat('Y-m-d', $draft['date'], config('booking.timezone'))->isoFormat('dddd D MMMM YYYY') }}
                @else
                    Scegli data e ora
                @endif
            </p>
        </div>
    </div>
    <div class="mt-5 rounded-2xl bg-accent px-4 py-3 text-xs text-muted-foreground">
        Puoi modificare la prenotazione fino a 2 ore prima dell'appuntamento.
    </div>
</aside>
