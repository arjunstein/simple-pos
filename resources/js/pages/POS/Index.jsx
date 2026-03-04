import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Index({ products, categories }) {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
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
        toast.success(`${product.name} added to cart`);
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
                setIsCartOpen(false);
                toast.success('Checkout successful!');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Checkout failed');
            }
        });
    };

    const CartContent = () => (
        <>
            {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    Cart is empty
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="max-h-[50vh] overflow-y-auto space-y-3">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => updateQuantity(item.id, -1)}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => updateQuantity(item.id, 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
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
        </>
    );

    return (
        <Layout>
            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold">Point of Sale</h1>
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild>
                            <Button className="lg:hidden w-full sm:w-auto">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Cart
                                <Badge className="ml-2">{cart.length}</Badge>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[60vh] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Shopping Cart</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4">
                                <CartContent />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:max-w-xs"
                            />
                            <div className="flex gap-1 flex-wrap">
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

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                            {filteredProducts.map(product => (
                                <Card
                                    key={product.id}
                                    className="cursor-pointer hover:shadow-md transition-all active:scale-95"
                                    onClick={() => addToCart(product)}
                                >
                                    <CardContent className="p-2 sm:p-3">
                                        <div className="font-medium text-sm truncate">{product.name}</div>
                                        <div className="text-xs text-muted-foreground hidden sm:block">
                                            {product.category?.name || '-'}
                                        </div>
                                        <div className="mt-1 sm:mt-2 font-bold text-sm sm:text-base">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </div>
                                        <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs">
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

                    <div className="hidden lg:block space-y-4">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Cart
                                    <Badge className="ml-2">{cart.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CartContent />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
