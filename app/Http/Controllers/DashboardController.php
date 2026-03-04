<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $today = now()->startOfDay();
        
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $ordersToday = Order::where('status', 'completed')->where('created_at', '>=', $today)->count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $avgOrderValue = Order::where('status', 'completed')->avg('total_amount') ?? 0;
        
        $recentOrders = Order::with('items.product')->latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'ordersToday' => $ordersToday,
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'avgOrderValue' => $avgOrderValue,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
