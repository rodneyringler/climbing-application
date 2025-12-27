'use client';
import { Category } from "@/app/lib/category/category";
import { lusitana } from "@/app/ui-components/fonts";
import Link from "next/link";
import Image from "next/image";
import { CategoryItem } from "@/app/lib/definitions";

export default function CategoriesTable({
  categories,
}: {
  categories: CategoryItem[];
}) {
    const colorValue = 200;
    return (
        <div className="grid grid-rows-[auto_1fr_auto] h-screen">
            <header className="bg-stone-100 p-4 rounded-md">Get Started With Pre-Made Plans:</header>
            <main className="bg-white p-4 rounded-lg overflow-auto">
                {categories?.map((category) => (
                    <div key={category.id} className="md:h-220 m-1 hover:ml-8 hover:w-full rounded-md bg-stone-400">
                        <div>
                            <h3 className={`${lusitana.className} text-lg left-2`}>{category.name}</h3>
                            <p>{category.imageUrl}</p>
                            <img src={`/${category.imageUrl}`} alt={category.description} width={100} height={100}/>
                        </div>
                        

                    </div>
                ))}
            </main>
        </div>
)}