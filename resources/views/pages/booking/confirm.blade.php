<x-layouts.booking title="Prenota - Conferma">
    <header class="border-b border-border bg-background">
        <div class="shell flex items-center justify-between py-4">
            <a href="{{ route('booking.contact') }}" class="text-sm font-semibold text-muted-foreground">← Contatti</a>
            <p class="font-semibold">Prenota appuntamento</p>
        </div>
    </header>
    <main class="shell py-6">
        <x-booking.stepper :current="5" />
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <form action="{{ route('booking.confirm.store') }}" method="POST" class="surface-card space-y-5 p-6">
                @csrf
                <input type="hidden" name="submit_token" value="{{ $submitToken }}">
                <div>
                    <h1 class="text-3xl font-semibold">Conferma prenotazione</h1>
                    <p class="mt-2 text-sm text-muted-foreground">Submit idempotente con token in sessione. In caso di conflitto verrai reindirizzato alla pagina dedicata.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="rounded-3xl bg-muted p-4">
                        <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Cliente</p>
                        <p class="mt-2 font-semibold">{{ $draft['customer_name'] }}</p>
                        <p class="mt-1 text-sm text-muted-foreground">{{ $draft['customer_phone'] }}</p>
                        @if (!empty($draft['customer_email']))
                            <p class="mt-1 text-sm text-muted-foreground">{{ $draft['customer_email'] }}</p>
                        @endif
                    </div>
                    <div class="rounded-3xl bg-muted p-4">
                        <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Note</p>
                        <p class="mt-2 text-sm text-muted-foreground">{{ $draft['notes'] ?: 'Nessuna nota aggiuntiva.' }}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <a href="{{ route('booking.contact') }}" class="btn-secondary">Indietro</a>
                    <button class="btn-primary" type="submit">Conferma e prenota</button>
                </div>
            </form>
            <x-booking.summary-sticky :service="$service" :draft="$draft" />
        </div>
    </main>
</x-layouts.booking>
