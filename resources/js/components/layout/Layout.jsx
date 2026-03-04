import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    FolderTree,
    ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'POS', href: '/pos', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: FolderTree },
    { name: 'Orders', href: '/orders', icon: ClipboardList },
];

export default function Layout({ children }) {
    const { url } = usePage();

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white">
                <div className="flex-1 flex flex-col min-h-0 border-r">
                    <div className="flex items-center h-16 px-4 font-bold text-lg">
                        POS Application
                    </div>
                    <Separator />
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = url === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
            <div className="md:pl-64 flex flex-col flex-1">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <span className="font-bold">POS Application</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="flex flex-col space-y-2 mt-4">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = url === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
                <Toaster />
            </div>
        </div>
    );
}
