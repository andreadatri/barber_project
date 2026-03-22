@props(['current' => 1, 'steps' => ['Servizio', 'Data', 'Ora', 'Contatti', 'Conferma']])

<div class="flex items-center gap-2 overflow-x-auto py-2">
    @foreach ($steps as $index => $step)
        @php($number = $index + 1)
        <div class="flex items-center gap-2">
            <div @class([
                'step-pill',
                'border-primary bg-primary text-primary-foreground' => $current > $number,
                'border-primary text-primary' => $current === $number,
                'border-border bg-white text-muted-foreground' => $current < $number,
            ])>
                {{ $current > $number ? '✓' : $number }}
            </div>
            <span class="hidden text-xs font-medium text-muted-foreground sm:inline">{{ $step }}</span>
            @if (! $loop->last)
                <div @class([
                    'h-px w-8 sm:w-12',
                    'bg-primary' => $current > $number,
                    'bg-border' => $current <= $number,
                ])></div>
            @endif
        </div>
    @endforeach
</div>
