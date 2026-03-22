<x-layouts.admin title="Appuntamenti">
    <div class="p-6 sm:p-8">
        <h1 class="text-4xl font-semibold">Appuntamenti</h1>
        <div class="surface-card mt-8 overflow-hidden">
            <table class="min-w-full text-left text-sm">
                <thead class="bg-muted">
                    <tr>
                        <th class="px-5 py-4">Cliente</th>
                        <th class="px-5 py-4">Servizio</th>
                        <th class="px-5 py-4">Inizio</th>
                        <th class="px-5 py-4">Stato</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($appointments as $appointment)
                        <tr class="border-t border-border">
                            <td class="px-5 py-4 font-medium">{{ $appointment->customer_name }}</td>
                            <td class="px-5 py-4">{{ $appointment->service->name }}</td>
                            <td class="px-5 py-4">{{ $appointment->start_at->setTimezone(config('booking.timezone'))->format('d/m/Y H:i') }}</td>
                            <td class="px-5 py-4 capitalize">{{ $appointment->status }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-5 py-8 text-muted-foreground">Nessun appuntamento disponibile.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-layouts.admin>
