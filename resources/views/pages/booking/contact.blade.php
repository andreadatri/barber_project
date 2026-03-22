<x-layouts.booking title="Prenota - Contatti">
    <header class="border-b border-border bg-background">
        <div class="shell flex items-center justify-between py-4">
            <a href="{{ route('booking.time') }}" class="text-sm font-semibold text-muted-foreground">← Orario</a>
            <p class="font-semibold">Prenota appuntamento</p>
        </div>
    </header>
    <main class="shell py-6">
        <x-booking.stepper :current="4" />
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <form action="{{ route('booking.contact.store') }}" method="POST" class="surface-card space-y-5 p-6">
                @csrf
                <div>
                    <h1 class="text-3xl font-semibold">I tuoi contatti</h1>
                    <p class="mt-2 text-sm text-muted-foreground">Completa il draft prima della conferma finale.</p>
                </div>
                <div class="grid gap-4">
                    <input class="field-input" type="text" name="customer_name" placeholder="Nome e cognome" value="{{ old('customer_name', $draft['customer_name'] ?? '') }}">
                    <input class="field-input" type="text" name="customer_phone" placeholder="Telefono" value="{{ old('customer_phone', $draft['customer_phone'] ?? '') }}">
                    <input class="field-input" type="email" name="customer_email" placeholder="Email facoltativa" value="{{ old('customer_email', $draft['customer_email'] ?? '') }}">
                    <textarea class="field-input min-h-28" name="notes" placeholder="Note facoltative">{{ old('notes', $draft['notes'] ?? '') }}</textarea>
                </div>
                <div class="flex items-center justify-between">
                    <a href="{{ route('booking.time') }}" class="btn-secondary">Indietro</a>
                    <button class="btn-primary" type="submit">Vai alla conferma</button>
                </div>
            </form>
            <x-booking.summary-sticky :service="$service" :draft="$draft" />
        </div>
    </main>
</x-layouts.booking>
