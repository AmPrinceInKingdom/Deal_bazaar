import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function WishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("wishlist_items")
    .select(`
      id,
      products (
        id,
        name,
        slug,
        price,
        thumbnail_url
      )
    `)
    .eq("user_id", user.id);

  const items = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-bold mb-6">
        My Wishlist
      </h1>

      {!items.length ? (
        <p>No wishlist items</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item: any) => {
            const product = item.products;

            return (
              <Link
                key={item.id}
                href={`/product/${product.slug}`}
                className="rounded-2xl border p-4"
              >
                <img
                  src={product.thumbnail_url}
                  className="w-full h-40 object-cover rounded-xl"
                />

                <p className="mt-2 font-semibold">
                  {product.name}
                </p>

                <p className="text-sm text-zinc-500">
                  Rs. {product.price}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}