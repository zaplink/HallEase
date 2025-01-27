import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabaseServer";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <h1>Customize dashbord here..</h1>
      <p>Hello {data.user.email}</p>
    </>
  );
}
