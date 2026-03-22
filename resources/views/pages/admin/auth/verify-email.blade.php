<x-layouts.public title="Verifica Email">
    <main class="shell flex min-h-screen items-center py-16">
        <div class="surface-card mx-auto w-full max-w-md p-8">
            <p class="text-sm uppercase tracking-[0.3em] text-primary">Account</p>
            <h1 class="mt-4 text-3xl font-semibold">Verifica la tua email</h1>
            <p class="mt-4 text-sm text-muted-foreground">
                Prima di continuare, conferma il tuo indirizzo email tramite il link che ti abbiamo inviato.
            </p>

            @if ($status === 'verification-link-sent')
                <div class="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    Ti abbiamo appena inviato un nuovo link di verifica.
                </div>
            @endif

            <div class="mt-8 space-y-3">
                <form method="POST" action="{{ route('verification.send') }}">
                    @csrf
                    <button class="btn-primary w-full" type="submit">Invia di nuovo il link</button>
                </form>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button class="btn-secondary w-full" type="submit">Esci</button>
                </form>
            </div>
        </div>
    </main>
</x-layouts.public>
