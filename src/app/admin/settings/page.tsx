import { createClient } from "@/lib/supabase/server";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (!settings) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        Settings not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <SiteSettingsForm settings={settings} />
    </div>
  );
}