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

export default function Index({ orders }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const variants = {
            completed: 'default',
            pending: 'secondary',
            cancelled: 'destructive',
        };
        return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
    };

    return (
        <Layout>
            <div className="space-y-3 sm:space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
                
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">All Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">ID</TableHead>
                                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
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
                                            <TableCell className="text-right font-bold">
                                                {formatCurrency(order.total_amount)}
                                            </TableCell>
                                            <TableCell className="text-right">{getStatusBadge(order.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">
                                                No orders found
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
