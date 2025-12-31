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
                    <div key={category.id} className="md:h-220 m-1 hover:ml-8 hover:w-full rounded-md bg-stone-300">
                        <div className="flex flex-row">
                            <div className="border-stone-500 rounded-md border-2 w-24 bg-stone-200">
                                <h3 className={`${lusitana.className} text-lg left-2`}>{category.name}</h3>
                                <img src={`/${category.imageUrl}`} alt={category.description} className="pleft-4 w-24 h-24"/>
                            </div>
                        {category.programs?.map((program) => (
                            <a href={`/programs/${program.name}`} className="p-2 m-2" key={program.id}>
                                <div className={`p-2 w-24 h-24 border-2 group rounded-md bg-stone-400 hover:bg-stone-500 hover:w-full`}>
                                    <h4 className="text-md">{program.name}</h4>
                                    <p className="text-white hidden group-hover:block">{program.description}</p>
                                </div>
                            </a>
                        ))}
                        </div>
                    </div>
                ))}
            </main>
        </div>
)}