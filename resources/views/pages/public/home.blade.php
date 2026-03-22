<x-layouts.public :title="$settings['shop_name']">
    <header class="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div class="shell flex items-center justify-between py-4">
            <div class="flex items-center gap-3">
                <div class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">IB</div>
                <div>
                    <p class="text-lg font-semibold">{{ $settings['shop_name'] }}</p>
                    <p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">{{ $settings['shop_city'] }}</p>
                </div>
            </div>
            <a href="{{ route('booking.service') }}" class="btn-primary">Prenota ora</a>
        </div>
    </header>

    <main>
        <section class="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,_rgba(202,166,89,0.24),_transparent_40%),linear-gradient(180deg,#f9f4ea_0%,#fffdf8_70%)]">
            <div class="shell grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
                <div class="space-y-6">
                    <p class="text-sm font-semibold uppercase tracking-[0.36em] text-primary">Taglio, barba, stile</p>
                    <h1 class="max-w-2xl text-5xl font-semibold leading-tight sm:text-6xl">Prenotazione mobile-first per il tuo prossimo appuntamento.</h1>
                    <p class="max-w-xl text-lg text-muted-foreground">Ho adattato il concept dello zip a Laravel Blade: landing elegante, wizard SSR a step e area admin pronta per essere estesa con CRUD reali.</p>
                    <div class="flex flex-col gap-4 sm:flex-row">
                        <a href="{{ route('booking.service') }}" class="btn-primary">Inizia la prenotazione</a>
                        <a href="{{ $phoneHref }}" class="btn-secondary">Chiama {{ $settings['shop_phone'] }}</a>
                    </div>
                </div>
                <div class="surface-card bg-[#17120d] p-8 text-white">
                    <p class="text-xs uppercase tracking-[0.34em] text-white/60">Oggi in evidenza</p>
                    <div class="mt-6 space-y-5">
                        @foreach ($services->take(3) as $service)
                            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                                <div class="flex items-center justify-between gap-4">
                                    <div>
                                        <p class="font-semibold">{{ $service->name }}</p>
                                        <p class="mt-1 text-sm text-white/65">{{ $service->duration_minutes }} min</p>
                                    </div>
                                    <span class="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">{{ number_format($service->price_cents / 100, 2, ',', '.') }} €</span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section class="shell py-14">
            <div class="grid gap-6 md:grid-cols-3">
                <div class="surface-card p-6">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Indirizzo</p>
                    <p class="mt-4 text-lg font-medium">{{ $settings['shop_address'] }}, {{ $settings['shop_postal_code'] }} {{ $settings['shop_city'] }}</p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" class="mt-4 inline-block text-sm font-semibold text-primary">Visualizza mappa</a>
                </div>
                <div class="surface-card p-6">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Orari</p>
                    <div class="mt-4 space-y-2 text-sm text-muted-foreground">
                        @php($weekdayLabels = [0 => 'Domenica', 1 => 'Lunedi', 2 => 'Martedi', 3 => 'Mercoledi', 4 => 'Giovedi', 5 => 'Venerdi', 6 => 'Sabato'])
                        @foreach ($openingHours as $hours)
                            <p>{{ $weekdayLabels[$hours->weekday] ?? 'Giorno' }}: {{ substr($hours->start_time, 0, 5) }} - {{ substr($hours->end_time, 0, 5) }}</p>
                        @endforeach
                        @if (! $openingHours->contains(fn ($item) => $item->weekday === 0))
                            <p>Domenica: chiuso</p>
                        @endif
                    </div>
                </div>
                <div class="surface-card p-6">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Contatti</p>
                    <div class="mt-4 space-y-2 text-sm">
                        <a href="{{ $phoneHref }}" class="block font-medium">{{ $settings['shop_phone'] }}</a>
                        <a href="mailto:{{ $settings['shop_email'] }}" class="block text-muted-foreground">{{ $settings['shop_email'] }}</a>
                        <a href="{{ route('admin.dashboard') }}" class="inline-block pt-3 font-semibold text-primary">Anteprima admin</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="border-y border-border bg-muted/50 py-14">
            <div class="shell">
                <div class="surface-card overflow-hidden">
                    <iframe class="aspect-video w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3157379144516!2d9.186515!3d45.464211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI3JzUxLjIiTiA5wrAxMScxMS41IkU!5e0!3m2!1sen!2sit!4v1234567890" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </section>
    </main>

    <footer class="shell flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {{ $settings['shop_name'] }}. Tutti i diritti riservati.</p>
        <div class="flex gap-5">
            <a href="{{ route('privacy') }}">Privacy</a>
            <a href="{{ route('terms') }}">Termini</a>
        </div>
    </footer>
</x-layouts.public>
