<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;

Route::get('/', DashboardController::class)->name('dashboard');

Route::resource('categories', CategoryController::class);
Route::resource('products', ProductController::class);
Route::resource('orders', OrderController::class);
Route::get('/pos', [OrderController::class, 'pos'])->name('pos');
Route::post('/pos/checkout', [OrderController::class, 'checkout'])->name('pos.checkout');
