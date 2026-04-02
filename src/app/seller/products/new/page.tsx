import { createClient } from "@/lib/supabase/server";
import SellerAddProductForm from "@/components/seller/SellerAddProductForm";

export default async function SellerNewProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
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
      <div className="mx-auto max-w-5xl px-4 py-10">
        Seller access required.
      </div>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <SellerAddProductForm categories={categories ?? []} />
    </div>
  );
}