<?php

namespace App\Http\Controllers;

use App\Exceptions\BookingConflictException;
use App\Models\Appointment;
use App\Models\Service;
use App\Services\Availability\AvailabilityService;
use App\Services\Booking\BookingDraftService;
use App\Services\Booking\BookingService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BookingWizardController extends Controller
{
    public function __construct(
        private readonly BookingDraftService $drafts,
        private readonly AvailabilityService $availability,
        private readonly BookingService $bookings,
    ) {
    }

    public function service(): View
    {
        return view('pages.booking.service', [
            'services' => Service::query()->where('active', true)->orderBy('price_cents')->get(),
            'draft' => $this->drafts->all(),
        ]);
    }

    public function storeService(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
        ]);

        $this->drafts->resetAfter('service');
        $this->drafts->put($data);

        return redirect()->route('booking.date');
    }

    public function date(): RedirectResponse|View
    {
        $service = $this->drafts->selectedService();

        if (! $service) {
            return redirect()->route('booking.service');
        }

        return view('pages.booking.date', [
            'service' => $service,
            'dates' => $this->availability->availableDates($service),
            'draft' => $this->drafts->all(),
        ]);
    }

    public function storeDate(Request $request): RedirectResponse
    {
        $service = $this->drafts->selectedService();

        abort_if(! $service, 404);

        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ]);

        $this->drafts->resetAfter('date');
        $this->drafts->put($data);

        return redirect()->route('booking.time');
    }

    public function time(): RedirectResponse|View
    {
        $service = $this->drafts->selectedService();
        $draft = $this->drafts->all();

        if (! $service || empty($draft['date'])) {
            return redirect()->route('booking.date');
        }

        $date = CarbonImmutable::createFromFormat('Y-m-d', $draft['date'], config('booking.timezone'));

        return view('pages.booking.time', [
            'service' => $service,
            'date' => $date,
            'slots' => $this->availability->slotsForDate($service, $date),
            'draft' => $draft,
        ]);
    }

    public function storeTime(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'time' => ['required', 'date_format:H:i'],
        ]);

        $this->drafts->resetAfter('time');
        $this->drafts->put($data);

        return redirect()->route('booking.contact');
    }

    public function contact(): RedirectResponse|View
    {
        $service = $this->drafts->selectedService();
        $draft = $this->drafts->all();

        if (! $service || empty($draft['date']) || empty($draft['time'])) {
            return redirect()->route('booking.time');
        }

        return view('pages.booking.contact', [
            'service' => $service,
            'draft' => $draft,
        ]);
    }

    public function storeContact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->drafts->put($data);

        return redirect()->route('booking.confirm');
    }

    public function confirm(): RedirectResponse|View
    {
        $service = $this->drafts->selectedService();
        $draft = $this->drafts->all();

        if (! $service || empty($draft['customer_name']) || empty($draft['time'])) {
            return redirect()->route('booking.contact');
        }

        return view('pages.booking.confirm', [
            'service' => $service,
            'draft' => $draft,
            'submitToken' => $this->drafts->ensureToken(),
        ]);
    }

    public function storeConfirm(Request $request): RedirectResponse
    {
        $draft = $this->drafts->all();

        $request->validate([
            'submit_token' => ['required', 'string'],
        ]);

        abort_if(($draft['submit_token'] ?? null) !== $request->string('submit_token')->value(), 419);

        try {
            $appointment = $this->bookings->createFromDraft($draft);
        } catch (BookingConflictException) {
            return redirect()->route('booking.conflict');
        }

        $this->drafts->clear();

        return redirect()->route('booking.success', $appointment);
    }

    public function success(Appointment $appointment): View
    {
        $appointment->load('service');

        return view('pages.booking.success', [
            'appointment' => $appointment,
        ]);
    }

    public function conflict(): View
    {
        return view('pages.booking.conflict');
    }
}
