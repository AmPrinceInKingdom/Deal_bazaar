import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SellerOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
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
      <div className="mx-auto max-w-6xl px-4 py-10">
        Seller access required.
      </div>
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        id,
        name,
        thumbnail_url,
        seller_id
      ),
      orders (
        id,
        order_number,
        order_status,
        created_at,
        total_amount
      )
    `);

  const list =
    items?.filter((item: any) => item.products?.seller_id === user.id) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Seller Orders
      </h1>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No orders yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.products?.thumbnail_url ||
                    "/images/placeholder-product.jpg"
                  }
                  className="h-20 w-20 rounded-xl object-cover"
                  alt={item.products?.name || "Product"}
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-zinc-900 dark:text-white">
                    {item.products?.name}
                  </h2>

                  <p className="text-sm text-zinc-500">
                    Order #{item.orders?.order_number}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    Rs. {Number(item.unit_price || 0).toLocaleString()}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {item.orders?.order_status}
                  </p>

                  <Link
                    href={`/seller/orders/${item.orders?.id}`}
                    className="mt-2 inline-block text-sm text-red-500"
                  >
                    View
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