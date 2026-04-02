import { createClient } from "@/lib/supabase/server";
import UpdateSellerOrderStatus from "@/components/seller/UpdateSellerOrderStatus";
import ShippingUpdateForm from "@/components/orders/ShippingUpdateForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SellerOrderDetails({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="mx-auto max-w-5xl px-4 py-10">Please login</div>;
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        name,
        thumbnail_url,
        seller_id
      ),
      orders (
        id,
        order_number,
        order_status,
        shipping_full_name,
        shipping_address_line_1,
        shipping_city,
        courier_name,
        tracking_number,
        shipped_at,
        delivered_at
      )
    `)
    .eq("order_id", id);

  const sellerItems =
    items?.filter((i: any) => i.products?.seller_id === user.id) ?? [];

  if (!sellerItems.length) {
    return <div className="mx-auto max-w-5xl px-4 py-10">No access</div>;
  }

  const order = sellerItems[0].orders;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Order #{order.order_number}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Customer: {order.shipping_full_name || "-"}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {order.shipping_address_line_1 || "-"}, {order.shipping_city || "-"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {sellerItems.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <img
                src={
                  item.products?.thumbnail_url || "/images/placeholder-product.jpg"
                }
                className="h-16 w-16 rounded-lg object-cover"
                alt={item.products?.name || "Product"}
              />

              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {item.products?.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <UpdateSellerOrderStatus
            orderId={order.id}
            status={order.order_status}
          />

          <ShippingUpdateForm
            orderId={order.id}
            initialCourierName={order.courier_name}
            initialTrackingNumber={order.tracking_number}
            initialOrderStatus={order.order_status}
          />

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Current Shipping Info
            </h3>

            <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p>Courier: {order.courier_name || "-"}</p>
              <p>Tracking: {order.tracking_number || "-"}</p>
              <p>
                Shipped at:{" "}
                {order.shipped_at
                  ? new Date(order.shipped_at).toLocaleString()
                  : "-"}
              </p>
              <p>
                Delivered at:{" "}
                {order.delivered_at
                  ? new Date(order.delivered_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}