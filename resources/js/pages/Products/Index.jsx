import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ products, categories }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingProduct(null);
                    reset();
                    toast.success('Product updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'Failed to update product');
                }
            });
        } else {
            post('/products', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success('Product created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'Failed to create product');
                }
            });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            category_id: product.category_id.toString(),
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description || '',
        });
        setIsOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(`/products/${id}`, {
                onSuccess: () => {
                    toast.success('Product deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete product');
                }
            });
        }
    };

    const openNewDialog = () => {
        setEditingProduct(null);
        reset();
        setIsOpen(true);
    };

    return (
        <Layout>
            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
                    <Button onClick={openNewDialog} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
                
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">All Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Category</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right hidden sm:table-cell">Stock</TableHead>
                                        <TableHead className="w-24 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.id}</TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell className="hidden md:table-cell">{product.category?.name || '-'}</TableCell>
                                            <TableCell className="text-right">${parseFloat(product.price).toFixed(2)}</TableCell>
                                            <TableCell className="text-right hidden sm:table-cell">{product.stock}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {products.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">
                                                No products found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Product name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem 
                                                    key={category.id} 
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Optional description"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {editingProduct ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
