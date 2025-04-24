'use client'; // Menandakan komponen ini berjalan di sisi client

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, LogOut } from "lucide-react"; // Ikon modern dari lucide-react

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col p-6 transition-transform duration-300 ease-in-out">
        <div className="flex items-center mb-10">
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
        </div>

        <nav className="space-y-4">
          <NavItem href="/admin" active={pathname === "/admin"} icon={<Home size={20} />}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/users" active={pathname === "/admin/users"} icon={<Users size={20} />}>
            Manage Users
          </NavItem>
          <NavItem href="/admin/settings" active={pathname === "/admin/settings"} icon={<Settings size={20} />}>
            Settings
          </NavItem>
          <NavItem href="/admin/logout" active={pathname === "/admin/logout"} icon={<LogOut size={20} />}>
            Logout
          </NavItem>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-white shadow-lg rounded-l-3xl">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-gray-800">Welcome to the Admin Dashboard</h1>
        </div>

        {children}
      </main>
    </div>
  );
}

function NavItem({
  href,
  children,
  active,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
          active ? "bg-blue-700" : "hover:bg-blue-700"
        }`}
      >
        <div className="text-lg">{icon}</div>
        <span className="text-lg font-medium">{children}</span>
      </div>
    </Link>
  );
}
