@if (session('status') || session('success') || $errors->any())
    <div class="fixed right-4 top-4 z-50 max-w-sm space-y-3">
        @foreach (['status', 'success'] as $key)
            @if (session($key))
                <div data-flash class="surface-card flex items-start justify-between gap-3 px-4 py-3 text-sm">
                    <p>{{ session($key) }}</p>
                    <button type="button" data-flash-close class="text-muted-foreground">x</button>
                </div>
            @endif
        @endforeach
        @if ($errors->any())
            <div data-flash class="surface-card border-destructive/20 px-4 py-3 text-sm text-destructive">
                <div class="flex items-start justify-between gap-3">
                    <p>{{ $errors->first() }}</p>
                    <button type="button" data-flash-close class="text-muted-foreground">x</button>
                </div>
            </div>
        @endif
    </div>
@endif
