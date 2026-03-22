<?php

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\BookingApiController;
use App\Http\Controllers\Api\SiteApiController;
use Illuminate\Support\Facades\Route;

Route::get('/site', [SiteApiController::class, 'show']);
Route::get('/services', [BookingApiController::class, 'services']);
Route::get('/availability', [BookingApiController::class, 'availability']);
Route::post('/bookings', [BookingApiController::class, 'store']);

Route::prefix('admin')->middleware(['web', 'auth', 'admin'])->group(function () {
    Route::get('/me', [AdminApiController::class, 'me']);
    Route::get('/appointments', [AdminApiController::class, 'appointments']);
    Route::patch('/appointments/{appointment}', [AdminApiController::class, 'updateAppointment']);
    Route::get('/settings', [AdminApiController::class, 'settings']);
    Route::put('/settings', [AdminApiController::class, 'updateSettings']);
});
