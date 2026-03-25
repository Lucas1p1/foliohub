import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServicesManager } from "@/components/dashboard/services-manager";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("profile_id", user.id)
    .order("order_index");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground text-sm mt-1">List what you offer — clients will see this on your page</p>
      </div>
      <ServicesManager services={services ?? []} userId={user.id} />
    </div>
  );
}
