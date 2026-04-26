import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-50 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">AJCT Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-3 hover:bg-gray-800 rounded">Dashboard Home</Link>
          <Link href="/dashboard/students" className="block p-3 hover:bg-gray-800 rounded">Student List</Link>
        </nav>
        <Link href="/login" className="p-6 border-t border-gray-700 hover:text-red-400">Logout</Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}