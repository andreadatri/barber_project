<x-layouts.admin title="Servizi">
    <div class="p-6 sm:p-8">
        <h1 class="text-4xl font-semibold">Servizi</h1>
        <div class="surface-card mt-8 overflow-hidden">
            <table class="min-w-full text-left text-sm">
                <thead class="bg-muted">
                    <tr>
                        <th class="px-5 py-4">Nome</th>
                        <th class="px-5 py-4">Durata</th>
                        <th class="px-5 py-4">Prezzo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($services as $service)
                        <tr class="border-t border-border">
                            <td class="px-5 py-4 font-medium">{{ $service->name }}</td>
                            <td class="px-5 py-4">{{ $service->duration_minutes }} min</td>
                            <td class="px-5 py-4">{{ number_format($service->price_cents / 100, 2, ',', '.') }} €</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</x-layouts.admin>
