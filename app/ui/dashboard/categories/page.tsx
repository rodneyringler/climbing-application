import Image from "next/image"
import { Category } from "@/app/lib/category/category";
import { lusitana } from "@/app/ui-components/fonts";
import Link from "next/link";
import CategoriesTable from "@/app/ui-components/categories/table";


export default async function Page() {
  const categories = await Category.findAll();
  return (
    <div>
    <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Categories
    </h1>
    <CategoriesTable categories={categories} />
    </div>
  )
}
