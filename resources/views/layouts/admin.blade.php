<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title ? "{$title} | ".config('app.name', 'Barber Project') : config('app.name', 'Barber Project') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
        @vite('resources/js/app.ts')
    </head>
    <body class="bg-[#120f0b] text-white">
        @include('partials.flash')
        <div class="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
            <aside class="border-b border-sidebar-border bg-sidebar px-6 py-8 lg:border-b-0 lg:border-r">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 text-lg font-semibold">
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">IB</span>
                    Il Barbiere
                </a>
                <nav class="mt-10 space-y-2 text-sm">
                    <a href="{{ route('admin.dashboard') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Dashboard</a>
                    <a href="{{ route('admin.appointments.index') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Appuntamenti</a>
                    <a href="{{ route('admin.services.index') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Servizi</a>
                    <a href="{{ route('admin.settings.availability') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Disponibilita</a>
                    <a href="{{ route('admin.settings.closures') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Chiusure</a>
                    <a href="{{ route('admin.settings.general') }}" class="block rounded-2xl px-4 py-3 hover:bg-sidebar-accent">Impostazioni</a>
                </nav>
            </aside>
            <main class="bg-background text-foreground">
                {{ $slot }}
            </main>
        </div>
    </body>
</html>
