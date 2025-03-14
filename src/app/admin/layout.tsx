export const metadata = {
    title: "Admin Panel",
  };
  
  export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 bg-foreground text-background p-4 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <ul>
            <li className="mb-4">
              <a href="/admin/dashboard" className="block p-2 rounded hover:bg-primary">
                Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a href="/admin/users" className="block p-2 rounded hover:bg-primary">
                Manajemen Pengguna
              </a>
            </li>
            <li>
              <a href="/admin/reservations" className="block p-2 rounded hover:bg-primary">
                Reservasi
              </a>
            </li>
          </ul>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }
  