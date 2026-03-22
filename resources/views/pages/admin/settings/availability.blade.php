<x-layouts.admin title="Disponibilita">
    <div class="p-6 sm:p-8">
        <h1 class="text-4xl font-semibold">Disponibilita</h1>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
            @php($weekdayLabels = [0 => 'Domenica', 1 => 'Lunedi', 2 => 'Martedi', 3 => 'Mercoledi', 4 => 'Giovedi', 5 => 'Venerdi', 6 => 'Sabato'])
            @foreach ($openingHours as $hours)
                <div class="surface-card p-5">
                    <p class="text-sm uppercase tracking-[0.24em] text-primary">{{ $weekdayLabels[$hours->weekday] ?? 'Giorno' }}</p>
                    <p class="mt-3 text-xl font-semibold">{{ substr($hours->start_time, 0, 5) }} - {{ substr($hours->end_time, 0, 5) }}</p>
                </div>
            @endforeach
        </div>
    </div>
</x-layouts.admin>
