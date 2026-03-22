<x-layouts.booking title="Prenota - Ora">
    <header class="border-b border-border bg-background">
        <div class="shell flex items-center justify-between py-4">
            <a href="{{ route('booking.date') }}" class="text-sm font-semibold text-muted-foreground">← Data</a>
            <p class="font-semibold">Prenota appuntamento</p>
        </div>
    </header>
    <main class="shell py-6">
        <x-booking.stepper :current="3" />
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <form action="{{ route('booking.time.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <h1 class="text-3xl font-semibold">Seleziona l'orario</h1>
                    <p class="mt-2 text-sm text-muted-foreground">{{ $date->isoFormat('dddd D MMMM YYYY') }}</p>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    @forelse ($slots as $slot)
                        <label class="surface-card block cursor-pointer p-4 text-center">
                            <input type="radio" name="time" value="{{ $slot->format('H:i') }}" class="sr-only" @checked(($draft['time'] ?? null) === $slot->format('H:i'))>
                            <span class="text-lg font-semibold">{{ $slot->format('H:i') }}</span>
                        </label>
                    @empty
                        <div class="surface-card col-span-full p-6 text-sm text-muted-foreground">Nessuno slot disponibile per questa data. Torna indietro e scegli un altro giorno.</div>
                    @endforelse
                </div>
                <div class="flex items-center justify-between">
                    <a href="{{ route('booking.date') }}" class="btn-secondary">Indietro</a>
                    <button class="btn-primary" type="submit">Continua</button>
                </div>
            </form>
            <x-booking.summary-sticky :service="$service" :draft="$draft" />
        </div>
    </main>
</x-layouts.booking>
