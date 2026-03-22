<x-layouts.admin title="Dashboard">
    <div class="p-6 sm:p-8">
        <div class="flex items-end justify-between gap-4">
            <div>
                <p class="text-sm uppercase tracking-[0.3em] text-primary">Admin</p>
                <h1 class="mt-2 text-4xl font-semibold">Dashboard barber</h1>
            </div>
            <a href="{{ route('booking.service') }}" class="btn-primary">Apri booking</a>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="surface-card p-5">
                <p class="text-sm text-muted-foreground">Servizi attivi</p>
                <p class="mt-3 text-4xl font-semibold">{{ $serviceCount ?? 0 }}</p>
            </div>
            <div class="surface-card p-5">
                <p class="text-sm text-muted-foreground">Appuntamenti</p>
                <p class="mt-3 text-4xl font-semibold">{{ $appointmentCount ?? 0 }}</p>
            </div>
            <div class="surface-card p-5">
                <p class="text-sm text-muted-foreground">Chiusure pianificate</p>
                <p class="mt-3 text-4xl font-semibold">{{ $closureCount ?? 0 }}</p>
            </div>
        </div>
        <div class="surface-card mt-8 p-6">
            <h2 class="text-2xl font-semibold">Ultimi appuntamenti</h2>
            <div class="mt-4 space-y-3">
                @forelse (($upcomingAppointments ?? collect()) as $appointment)
                    <div class="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
                        <div>
                            <p class="font-semibold">{{ $appointment->customer_name }}</p>
                            <p class="text-muted-foreground">{{ $appointment->service->name }}</p>
                        </div>
                        <p>{{ $appointment->start_at->setTimezone(config('booking.timezone'))->format('d/m H:i') }}</p>
                    </div>
                @empty
                    <p class="text-sm text-muted-foreground">Nessun appuntamento ancora creato.</p>
                @endforelse
            </div>
        </div>
    </div>
</x-layouts.admin>
