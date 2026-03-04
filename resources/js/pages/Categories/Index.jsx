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
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ categories }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingCategory(null);
                    reset();
                    toast.success('Category updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'Failed to update category');
                }
            });
        } else {
            post('/categories', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success('Category created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'Failed to create category');
                }
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setData('name', category.name);
        setIsOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(`/categories/${id}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete category');
                }
            });
        }
    };

    const openNewDialog = () => {
        setEditingCategory(null);
        reset();
        setIsOpen(true);
    };

    return (
        <Layout>
            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
                    <Button onClick={openNewDialog} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
                
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">All Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-24 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.id}</TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            No categories found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                                        placeholder="Category name"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {editingCategory ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
