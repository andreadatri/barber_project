@props(['title' => null])

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
    <body class="bg-muted/60">
        @include('partials.flash')
        {{ $slot }}
    </body>
</html>
