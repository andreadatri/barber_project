<x-layouts.booking title="Prenotazione confermata">
    <main class="shell py-16">
        <div class="surface-card mx-auto max-w-2xl p-8 text-center">
            <p class="text-sm uppercase tracking-[0.3em] text-primary">Prenotazione confermata</p>
            <h1 class="mt-4 text-4xl font-semibold">Appuntamento registrato.</h1>
            <p class="mt-4 text-muted-foreground">
                {{ $appointment->service->name }} il
                {{ $appointment->start_at->setTimezone(config('booking.timezone'))->locale('it')->isoFormat('dddd D MMMM YYYY [alle] HH:mm') }}.
            </p>
            <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href="{{ route('home') }}" class="btn-secondary">Torna alla home</a>
                <a href="{{ route('booking.service') }}" class="btn-primary">Nuova prenotazione</a>
            </div>
        </div>
    </main>
</x-layouts.booking>
