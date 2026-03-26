<?php

use App\Http\Controllers\SpaController;
use Illuminate\Support\Facades\Route;

Route::get('/', SpaController::class)->name('home');
Route::get('/privacy', SpaController::class)->name('privacy');
Route::get('/termini', SpaController::class)->name('terms');
Route::get('/dashboard', fn () => redirect('/admin'))->middleware(['auth', 'admin'])->name('dashboard');
Route::get('/admin/login', SpaController::class)->middleware('guest')->name('admin.login');
Route::get('/prenota', SpaController::class)->name('booking.service');
Route::get('/prenota/{path}', SpaController::class)->where('path', '.*');
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/{path?}', SpaController::class)->where('path', '.*');
});
