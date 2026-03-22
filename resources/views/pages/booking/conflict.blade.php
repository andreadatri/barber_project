<x-layouts.booking title="Slot non disponibile">
    <main class="shell py-16">
        <div class="surface-card mx-auto max-w-2xl p-8 text-center">
            <p class="text-sm uppercase tracking-[0.3em] text-destructive">Conflitto slot</p>
            <h1 class="mt-4 text-4xl font-semibold">Questo orario non e piu disponibile.</h1>
            <p class="mt-4 text-muted-foreground">Il service layer ha rilevato un conflitto durante il re-check finale in transazione. Scegli un altro orario.</p>
            <div class="mt-8 flex justify-center">
                <a href="{{ route('booking.time') }}" class="btn-primary">Scegli un altro orario</a>
            </div>
        </div>
    </main>
</x-layouts.booking>
