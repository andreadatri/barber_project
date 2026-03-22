<x-layouts.public title="Admin Login">
    <main class="shell flex min-h-screen items-center py-16">
        <div class="surface-card mx-auto w-full max-w-md p-8">
            <p class="text-sm uppercase tracking-[0.3em] text-primary">Admin</p>
            <h1 class="mt-4 text-3xl font-semibold">Accedi al pannello</h1>
            <form method="POST" action="{{ route('login') }}" class="mt-8 space-y-4">
                @csrf
                <input class="field-input" type="email" name="email" placeholder="Email" required>
                <input class="field-input" type="password" name="password" placeholder="Password" required>
                <button class="btn-primary w-full" type="submit">Accedi</button>
            </form>
        </div>
    </main>
</x-layouts.public>
