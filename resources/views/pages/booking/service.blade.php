<x-layouts.booking title="Prenota - Servizio">
    <header class="border-b border-border bg-background">
        <div class="shell flex items-center justify-between py-4">
            <a href="{{ route('home') }}" class="text-sm font-semibold text-muted-foreground">← Torna alla home</a>
            <p class="font-semibold">Prenota appuntamento</p>
        </div>
    </header>
    <main class="shell py-6">
        <x-booking.stepper :current="1" />
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <form action="{{ route('booking.service.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <h1 class="text-3xl font-semibold">Seleziona servizio</h1>
                    <p class="mt-2 text-sm text-muted-foreground">Scegli il trattamento da prenotare. I dati vengono memorizzati in sessione come draft SSR.</p>
                </div>
                @forelse ($services as $service)
                    <label class="surface-card block cursor-pointer p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
                        <input type="radio" name="service_id" value="{{ $service->id }}" class="sr-only" @checked(($draft['service_id'] ?? null) == $service->id)>
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-lg font-semibold">{{ $service->name }}</p>
                                <p class="mt-2 text-sm text-muted-foreground">{{ $service->duration_minutes }} minuti di servizio.</p>
                            </div>
                            <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{{ number_format($service->price_cents / 100, 2, ',', '.') }} €</span>
                        </div>
                    </label>
                @empty
                    <div class="surface-card p-6 text-sm text-muted-foreground">Nessun servizio disponibile. Esegui prima `php artisan migrate --seed`.</div>
                @endforelse
                <div class="flex justify-end">
                    <button class="btn-primary" type="submit">Continua</button>
                </div>
            </form>
            <x-booking.summary-sticky :service="null" :draft="$draft" />
        </div>
    </main>
</x-layouts.booking>
