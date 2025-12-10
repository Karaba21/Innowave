'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: string[];
    productTitle: string;
    discount?: number;
    showDiscount?: boolean;
}

export function ProductImageGallery({
    images,
    productTitle,
    discount = 0,
    showDiscount = false
}: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    // If no images, show placeholder
    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center">
                <p className="text-gray-400">No hay imágenes disponibles</p>
            </div>
        );
    }

    const hasMultipleImages = images.length > 1;

    return (
        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
            {/* Discount Badge */}
            {showDiscount && discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-20">
                    -{discount}% OFF
                </span>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full">
                <Image
                    src={images[currentIndex]}
                    alt={`${productTitle} - Imagen ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority={currentIndex === 0}
                />
            </div>

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
                        aria-label="Imagen anterior"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="md:w-6 md:h-6"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
                        aria-label="Imagen siguiente"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="md:w-6 md:h-6"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    {/* Image Indicators (Dots) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-blue-600 w-8'
                                    : 'bg-white/70 hover:bg-white'
                                    }`}
                                aria-label={`Ir a imagen ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
                <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
}
