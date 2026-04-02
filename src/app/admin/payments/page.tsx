import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: proofs } = await supabase
    .from("payment_proofs")
    .select(`
      *,
      orders (
        order_number,
        total_amount,
        payment_status,
        order_status
      )
    `)
    .order("uploaded_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Payment Proofs
      </h1>

      <div className="mt-6 space-y-4">
        {proofs?.length ? (
          proofs.map((proof: any) => (
            <div
              key={proof.id}
              className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {proof.orders?.order_number}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Rs. {Number(proof.orders?.total_amount || 0).toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm capitalize text-zinc-500">
                    Proof: {proof.verification_status}
                  </p>

                  <p className="mt-1 text-sm capitalize text-zinc-500">
                    Order: {proof.orders?.order_status}
                  </p>

                  <p className="mt-1 text-sm capitalize text-zinc-500">
                    Payment: {proof.orders?.payment_status}
                  </p>

                  {proof.note ? (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {proof.note}
                    </p>
                  ) : null}
                </div>

                <a
                  href={proof.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  View Slip
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/admin/payments/${proof.id}/approve`}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Approve
                </Link>

                <Link
                  href={`/admin/payments/${proof.id}/reject`}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Reject
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-800">
            No payment proofs found.
          </div>
        )}
      </div>
    </div>
  );
}