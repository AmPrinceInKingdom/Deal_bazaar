import { createClient } from "@/lib/supabase/server";
import AddCouponForm from "@/components/admin/AddCouponForm";

export default async function AdminCouponsPage() {
  const supabase = await createClient();

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <AddCouponForm />

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Coupons
        </h2>

        {!coupons?.length ? (
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No coupons yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {coupons.map((coupon: any) => (
              <div
                key={coupon.id}
                className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold uppercase text-zinc-900 dark:text-white">
                      {coupon.code}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {coupon.discount_type} - {coupon.discount_value}
                    </p>
                  </div>

                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Used: {coupon.used_count} / {coupon.usage_limit ?? "∞"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}