import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-4">
        <SidebarTrigger />
        <div className="mt-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
