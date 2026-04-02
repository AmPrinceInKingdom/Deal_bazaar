import { createClient } from "@/lib/supabase/server";
import UserRoleForm from "@/components/admin/UserRoleForm";
import BlockUserButton from "@/components/admin/BlockUserButton";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (q.trim()) {
    const term = q.trim();
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: users } = await query;
  const list = users ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Change roles and control account access.
        </p>

        <form action="/admin/users" className="mt-5 flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>
      </div>

      {!list.length ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No users found.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((profile: any) => (
            <div
              key={profile.id}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {profile.full_name || "No name"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {profile.email}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    User ID: {profile.id}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-white">
                    Role
                  </p>
                  <UserRoleForm
                    userId={profile.id}
                    currentRole={profile.role || "customer"}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-white">
                    Access
                  </p>

                  <div className="space-y-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        profile.is_blocked
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      }`}
                    >
                      {profile.is_blocked ? "Blocked" : "Active"}
                    </span>

                    <BlockUserButton
                      userId={profile.id}
                      isBlocked={Boolean(profile.is_blocked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}