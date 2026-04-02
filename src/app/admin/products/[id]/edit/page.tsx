import { createClient } from "@/lib/supabase/server";
import AdminEditProductForm from "@/components/admin/AdminEditProductForm";
import AddProductImageForm from "@/components/admin/AddProductImageForm";
import DeleteProductImageButton from "@/components/admin/DeleteProductImageButton";
import ProductImageSortForm from "@/components/admin/ProductImageSortForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Admin access required.
        </div>
      </div>
    );
  }

  const [{ data: product }, { data: categories }, { data: images }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", { ascending: true }),
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order"),
    ]);

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Product not found.
        </div>
      </div>
    );
  }

  const galleryImages = images ?? [];
  const totalImages = (product.thumbnail_url ? 1 : 0) + galleryImages.length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <AdminEditProductForm
        product={product}
        categories={categories ?? []}
      />

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">
          Product Images
        </h2>

        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Cover image: required for active products. Total images allowed: 1 to 5.
        </p>

        <div className="mb-6 rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          Current total images: {totalImages} / 5
        </div>

        <AddProductImageForm
          productId={id}
          currentCount={galleryImages.length}
        />

        {galleryImages.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img: any) => (
              <div
                key={img.id}
                className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <img
                  src={img.image_url}
                  alt="Product"
                  className="h-40 w-full rounded-xl object-cover"
                />

                <div className="mt-4 flex flex-col gap-3">
                  <ProductImageSortForm
                    imageId={img.id}
                    productId={id}
                    initialSortOrder={img.sort_order ?? 0}
                  />

                  <DeleteProductImageButton
                    imageId={img.id}
                    productId={id}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No extra gallery images added yet.
          </div>
        )}
      </div>
    </div>
  );
}