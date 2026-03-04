<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product')->latest()->get();
        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function pos()
    {
        $products = Product::with('category')->where('stock', '>', 0)->get();
        $categories = Category::all();
        return Inertia::render('POS/Index', [
            'products' => $products,
            'categories' => $categories
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric'
        ]);

        $order = Order::create([
            'total_amount' => $validated['total'],
            'status' => 'completed'
        ]);

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'subtotal' => $product->price * $item['quantity']
            ]);
            $product->decrement('stock', $item['quantity']);
        }

        return Inertia::location(route('pos'));
    }
}
