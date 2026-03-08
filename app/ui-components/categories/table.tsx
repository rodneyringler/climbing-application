'use client';

import React, { useState } from 'react';
import { lusitana } from '@/app/ui-components/fonts';
import Image from 'next/image';
import { CategoryItem } from '@/app/lib/definitions';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CategoriesTable({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories?.map((category) => (
        <div
          key={category.id}
          className="rounded-lg bg-white shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Category Image — clicking header also toggles programs */}
          <div
            className="relative h-48 w-full cursor-pointer"
            onClick={() => toggleCategory(category.id)}
          >
            <Image
              src={`/${category.imageUrl}`}
              alt={category.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3
              className={`${lusitana.className} absolute bottom-3 left-4 text-2xl font-bold text-white`}
            >
              {category.name}
            </h3>
          </div>

          {/* Category Description & Programs Toggle */}
          <div className="p-4">
            <p className="text-sm text-stone-600 mb-3">{category.description}</p>

            <button
              onClick={() => toggleCategory(category.id)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors w-full"
            >
              {expandedId === category.id ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
              Programs ({category.programs.length})
            </button>

            {/* Expanded Programs List */}
            {expandedId === category.id && (
              <div className="mt-3 space-y-2">
                {category.programs.length === 0 ? (
                  <p className="text-sm text-stone-400 italic">
                    No programs in this category yet.
                  </p>
                ) : (
                  category.programs.map((program) => (
                    <div
                      key={program.id}
                      className="rounded-md bg-stone-50 border border-stone-200 p-3"
                    >
                      <p className="text-sm font-medium text-stone-800">
                        {program.name}
                      </p>
                      {program.description && (
                        <p className="text-xs text-stone-500 mt-1">
                          {program.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
