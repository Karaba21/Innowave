'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function Search({ className, onSearch }: { className?: string; onSearch?: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            onSearch?.();
        }
    };

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-500 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                <SearchIcon size={18} />
            </button>
        </form>
    );
}
