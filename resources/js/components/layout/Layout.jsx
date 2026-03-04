import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    FolderTree,
    ClipboardList,
    Menu
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
        <div className="flex h-screen bg-gray-50">
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center h-14 px-4 font-bold text-lg border-b">
                        POS Application
                    </div>
                    <nav className="flex-1 px-2 py-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = url === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
            <div className="lg:pl-64 flex flex-col flex-1 w-full">
                <header className="lg:hidden flex items-center justify-between p-3 bg-white border-b shadow-sm">
                    <span className="font-bold text-lg">POS</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <div className="font-bold text-lg mb-4">POS Application</div>
                            <Separator className="mb-4" />
                            <nav className="flex flex-col space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = url === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
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
                </header>
                <main className="flex-1 overflow-y-auto p-3 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                <Toaster />
            </div>
        </div>
    );
}
