"use client";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user || (user.role !== 'ceo' && user.role !== 'accountant' && user.role !== 'driver')) {
        router.replace('/login');
        return null;
    }
    return (
        <div className="min-h-screen">
            <nav className="bg-white shadow-sm">
                <div className="px-4 py-3">
                    <h1 className="text-xl font-semibold">SEO Tools</h1>
                </div>
            </nav>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}