import { usePage } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DollarSign, ShoppingBag, Package, TrendingUp, FolderTree } from 'lucide-react';

export default function Dashboard() {
    const { props } = usePage();
    const stats = props.stats || {};
    const recentOrders = props.recentOrders || [];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Today</CardTitle>
                            <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-2xl font-bold">{stats.ordersToday || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Products</CardTitle>
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-2xl font-bold">{stats.totalProducts || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Categories</CardTitle>
                            <FolderTree className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-2xl font-bold">{stats.totalCategories || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 sm:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Avg Value</CardTitle>
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.avgOrderValue)}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">ID</TableHead>
                                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{formatDate(order.created_at)}</TableCell>
                                            <TableCell>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        {item.product?.name || 'Product'} x {item.quantity}
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {formatCurrency(order.total_amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">
                                                No orders yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
