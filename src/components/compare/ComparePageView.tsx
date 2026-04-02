"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "Rs 24,500",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: "Rs 6,500",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
    category: "Accessories",
  },
];

export default function ComparePageView() {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Compare Products
          </h1>
          <p className="text-sm text-zinc-500">
            Compare selected items side by side
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border bg-white p-4 dark:bg-zinc-950 dark:border-zinc-800"
            >
              <button className="ml-auto block text-zinc-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>

              <div className="relative h-40 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="mt-3 font-semibold">
                {product.name}
              </h3>

              <p className="text-sm text-zinc-500">
                {product.category}
              </p>

              <p className="mt-2 font-bold text-red-600">
                {product.price}
              </p>

              <Link
                href="/cart"
                className="mt-3 block text-center bg-red-600 text-white py-2 rounded-full text-sm"
              >
                Add to cart
              </Link>
            </div>
          ))}
        </div>

        {/* comparison table */}

        <div className="mt-10 rounded-2xl border bg-white p-6 dark:bg-zinc-950 dark:border-zinc-800">
          <h3 className="font-semibold mb-4">Comparison</h3>

          <div className="space-y-3 text-sm">
            
            <div className="flex justify-between">
              <span>Brand</span>
              <span>DealBazaar</span>
            </div>

            <div className="flex justify-between">
              <span>Warranty</span>
              <span>1 Year</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}