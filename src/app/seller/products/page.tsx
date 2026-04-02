import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function SellerProductsPage({ searchParams }: Props) {
  const { search = "" } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        Please log in first.
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        Seller access required.
      </div>
    );
  }

  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (search.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%,sku.ilike.%${term}%`);
  }

  const { data: products } = await query;
  const list = products ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            My Products
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage products added under your seller account.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/seller/products/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
          >
            Add Product
          </Link>

          <form className="flex gap-3" action="/seller/products">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search name, slug, or SKU"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white sm:w-72"
            />
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No seller products found.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((product: any) => (
            <div
              key={product.id}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <img
                    src={product.thumbnail_url || "/images/placeholder-product.jpg"}
                    alt={product.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Slug: {product.slug}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      SKU: {product.sku || "-"}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Category: {product.categories?.name || "General"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        Status: {product.status}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        Featured: {product.is_featured ? "Yes" : "No"}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>

                    <p className="mt-3 text-base font-bold text-zinc-900 dark:text-white">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-[220px]">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                  >
                    Edit Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}