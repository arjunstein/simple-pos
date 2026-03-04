import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ products, categories }) {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { post } = useForm();

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + delta;
                    if (newQuantity <= 0) return null;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean);
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        router.post('/pos/checkout', {
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: cartTotal
        }, {
            onSuccess: () => {
                setCart([]);
                toast.success('Checkout successful!');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Checkout failed');
            }
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Point of Sale</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <div className="flex gap-1">
                                <Button
                                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All
                                </Button>
                                {categories.map(category => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredProducts.map(product => (
                                <Card
                                    key={product.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => addToCart(product)}
                                >
                                    <CardContent className="p-4">
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.category?.name || '-'}
                                        </div>
                                        <div className="mt-2 font-bold">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </div>
                                        <Badge variant="secondary" className="mt-1">
                                            Stock: {product.stock}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full text-center py-8 text-muted-foreground">
                                    No products found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Cart
                                    <Badge className="ml-2">{cart.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cart.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Cart is empty
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Separator />
                                        <div className="flex justify-between items-center text-lg font-bold">
                                            <span>Total</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleCheckout}
                                        >
                                            Checkout
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
