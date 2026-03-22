<x-layouts.admin title="Chiusure">
    <div class="p-6 sm:p-8">
        <h1 class="text-4xl font-semibold">Chiusure</h1>
        <div class="surface-card mt-8 p-6">
            @forelse ($closures as $closure)
                <div class="flex items-center justify-between border-b border-border py-4 last:border-0">
                    <div>
                        <p class="font-semibold">{{ $closure->reason ?: 'Chiusura pianificata' }}</p>
                        <p class="text-sm text-muted-foreground">{{ $closure->start_at->setTimezone(config('booking.timezone'))->format('d/m/Y H:i') }} - {{ $closure->end_at->setTimezone(config('booking.timezone'))->format('d/m/Y H:i') }}</p>
                    </div>
                </div>
            @empty
                <p class="text-sm text-muted-foreground">Nessuna chiusura registrata.</p>
            @endforelse
        </div>
    </div>
</x-layouts.admin>
