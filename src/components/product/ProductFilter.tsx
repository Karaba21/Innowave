'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types';

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

interface FilterGroup {
    id: keyof NonNullable<Product['metafields']> | 'category';
    label: string;
    options: FilterOption[];
}

interface ProductFilterProps {
    products: Product[];
}

export function ProductFilter({ products }: ProductFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false); // Mobile drawer state

    // Extract available filters from products
    const filters: FilterGroup[] = [
        { id: 'marca', label: 'Marca', options: [] },
        { id: 'color', label: 'Color', options: [] },
        { id: 'tecnologia_bateria', label: 'Tecnología de la batería', options: [] },
        { id: 'estado_estetico', label: 'Estado estético', options: [] },
        { id: 'red_de_datos', label: 'Red de datos', options: [] },
        { id: 'sistema_operativo', label: 'Sistema operativo', options: [] },
        { id: 'capacidad_tarjeta_sim', label: 'Capacidad de tarjeta SIM', options: [] },
        { id: 'tipo_suscripcion', label: 'Tipo de suscripción', options: [] },
    ];

    filters.forEach(group => {
        const counts: Record<string, number> = {};
        products.forEach(product => {
            const value = group.id === 'category' ? product.category : product.metafields?.[group.id as keyof typeof product.metafields];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });
        group.options = Object.entries(counts).map(([value, count]) => ({
            label: value,
            value,
            count,
        }));
    });

    // Remove empty groups
    const activeFilters = filters.filter(group => group.options.length > 0);

    console.log('ProductFilter - Products count:', products.length);
    console.log('ProductFilter - Active filters:', JSON.stringify(activeFilters, null, 2));

    const handleFilterChange = (groupId: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get(groupId);

        if (current === value) {
            params.delete(groupId);
        } else {
            params.set(groupId, value);
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(window.location.pathname, { scroll: false });
    };

    const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="4" y1="21" y2="14" />
                        <line x1="4" x2="4" y1="10" y2="3" />
                        <line x1="12" x2="12" y1="21" y2="12" />
                        <line x1="12" x2="12" y1="8" y2="3" />
                        <line x1="20" x2="20" y1="21" y2="16" />
                        <line x1="20" x2="20" y1="12" y2="3" />
                        <line x1="1" x2="7" y1="14" y2="14" />
                        <line x1="9" x2="15" y1="8" y2="8" />
                        <line x1="17" x2="23" y1="16" y2="16" />
                    </svg>
                    Filtrar y Ordenar
                </button>
            </div>

            {/* Desktop Sidebar / Mobile Drawer */}
            <div className={`
                fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `} onClick={() => setIsOpen(false)} />

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:transform-none lg:static lg:w-full lg:shadow-none lg:block lg:bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-6
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full overflow-y-auto p-6 lg:p-0 lg:overflow-visible">
                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Filtros</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-8 lg:sticky lg:top-8">
                        {hasActiveFilters && (
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200 lg:border-none lg:pb-0">
                                <span className="text-sm font-medium text-gray-900">Filtros activos</span>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-medium text-gray-500 hover:text-black uppercase tracking-wide transition-colors"
                                >
                                    Borrar todos
                                </button>
                            </div>
                        )}

                        {activeFilters.map((group) => (
                            <div key={group.id} className="group/section">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">{group.label}</h3>
                                <div className="space-y-3">
                                    {group.options.map((option) => {
                                        const isSelected = searchParams.get(group.id) === option.value;
                                        return (
                                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group/option">
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                                                    ${isSelected
                                                        ? 'bg-black border-black shadow-sm'
                                                        : 'border-gray-300 bg-white group-hover/option:border-gray-400'
                                                    }
                                                `}>
                                                    {isSelected && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => handleFilterChange(group.id, option.value)}
                                                />
                                                <span className={`text-sm transition-colors ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover/option:text-gray-900'}`}>
                                                    {option.label}
                                                </span>
                                                <span className="ml-auto text-xs text-gray-400 font-medium tabular-nums">
                                                    {option.count}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
