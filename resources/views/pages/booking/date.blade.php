<x-layouts.booking title="Prenota - Data">
    <header class="border-b border-border bg-background">
        <div class="shell flex items-center justify-between py-4">
            <a href="{{ route('booking.service') }}" class="text-sm font-semibold text-muted-foreground">← Servizio</a>
            <p class="font-semibold">Prenota appuntamento</p>
        </div>
    </header>
    <main class="shell py-6">
        <x-booking.stepper :current="2" />
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <form action="{{ route('booking.date.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <h1 class="text-3xl font-semibold">Scegli la data</h1>
                    <p class="mt-2 text-sm text-muted-foreground">Gli slot arrivano dal service layer Laravel e rispettano orari, anticipo minimo e appuntamenti gia registrati.</p>
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                    @foreach ($dates as $availableDate)
                        <label class="surface-card block cursor-pointer p-5">
                            <input type="radio" name="date" value="{{ $availableDate->format('Y-m-d') }}" class="sr-only" @checked(($draft['date'] ?? null) === $availableDate->format('Y-m-d'))>
                            <p class="text-xs uppercase tracking-[0.24em] text-primary">{{ $availableDate->isoFormat('ddd') }}</p>
                            <p class="mt-2 text-lg font-semibold">{{ $availableDate->isoFormat('D MMMM') }}</p>
                            <p class="mt-1 text-sm text-muted-foreground">{{ $availableDate->isoFormat('YYYY') }}</p>
                        </label>
                    @endforeach
                </div>
                <div class="flex items-center justify-between">
                    <a href="{{ route('booking.service') }}" class="btn-secondary">Indietro</a>
                    <button class="btn-primary" type="submit">Continua</button>
                </div>
            </form>
            <x-booking.summary-sticky :service="$service" :draft="$draft" />
        </div>
    </main>
</x-layouts.booking>
