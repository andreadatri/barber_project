<x-layouts.admin title="Impostazioni">
    <div class="p-6 sm:p-8">
        <div class="max-w-3xl">
            <p class="text-sm uppercase tracking-[0.3em] text-primary">Admin</p>
            <h1 class="mt-2 text-4xl font-semibold">Impostazioni negozio</h1>
            <p class="mt-3 text-sm text-muted-foreground">Aggiorna i dati mostrati nella home e usati per i contatti rapidi.</p>

            <form action="{{ route('admin.settings.general.update') }}" method="POST" class="surface-card mt-8 space-y-6 p-6">
                @csrf
                @method('PUT')

                <div class="grid gap-5 md:grid-cols-2">
                    <div class="space-y-2 md:col-span-2">
                        <label class="text-sm font-medium" for="shop_name">Nome attivita</label>
                        <input id="shop_name" name="shop_name" class="field-input" type="text" value="{{ old('shop_name', $settings['shop_name']) }}" required>
                    </div>

                    <div class="space-y-2 md:col-span-2">
                        <label class="text-sm font-medium" for="shop_address">Indirizzo</label>
                        <input id="shop_address" name="shop_address" class="field-input" type="text" value="{{ old('shop_address', $settings['shop_address']) }}" required>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="shop_city">Citta</label>
                        <input id="shop_city" name="shop_city" class="field-input" type="text" value="{{ old('shop_city', $settings['shop_city']) }}" required>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="shop_postal_code">CAP</label>
                        <input id="shop_postal_code" name="shop_postal_code" class="field-input" type="text" value="{{ old('shop_postal_code', $settings['shop_postal_code']) }}" required>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="shop_phone">Telefono</label>
                        <input id="shop_phone" name="shop_phone" class="field-input" type="tel" value="{{ old('shop_phone', $settings['shop_phone']) }}" required>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium" for="shop_email">Email</label>
                        <input id="shop_email" name="shop_email" class="field-input" type="email" value="{{ old('shop_email', $settings['shop_email']) }}" required>
                    </div>

                    <div class="space-y-2 md:col-span-2">
                        <label class="text-sm font-medium" for="shop_vat_number">Partita IVA</label>
                        <input id="shop_vat_number" name="shop_vat_number" class="field-input" type="text" value="{{ old('shop_vat_number', $settings['shop_vat_number']) }}">
                    </div>
                </div>

                <div class="flex items-center justify-between gap-4 border-t border-border pt-5">
                    <p class="text-sm text-muted-foreground">Il pulsante "Chiama" in home usera questo numero.</p>
                    <button class="btn-primary" type="submit">Salva impostazioni</button>
                </div>
            </form>
        </div>
    </div>
</x-layouts.admin>
