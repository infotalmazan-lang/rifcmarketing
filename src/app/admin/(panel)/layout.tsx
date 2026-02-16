import AdminSidebar from "../components/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12 overflow-auto">{children}</main>
    </div>
  );
}
