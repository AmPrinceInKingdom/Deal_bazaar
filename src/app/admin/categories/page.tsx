import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  const list = categories ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Categories
        </h1>

        <Link
          href="/admin/categories/new"
          className="rounded-xl bg-red-600 px-4 py-2 text-white"
        >
          Add Category
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border p-10 text-center dark:border-zinc-800">
          No categories yet
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border dark:border-zinc-800">
          <table className="w-full">
            <thead className="border-b dark:border-zinc-800">
              <tr className="text-left text-sm text-zinc-600 dark:text-zinc-400">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((cat: any) => (
                <tr
                  key={cat.id}
                  className="border-b dark:border-zinc-800"
                >
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">
                    {cat.name}
                  </td>

                  <td className="p-4 text-sm text-zinc-500">
                    {cat.slug}
                  </td>

                  <td className="p-4">
                    {cat.is_active ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="rounded border px-3 py-1 text-sm dark:border-zinc-700"
                      >
                        Edit
                      </Link>

                      <button className="rounded border px-3 py-1 text-sm text-red-600 dark:border-zinc-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}