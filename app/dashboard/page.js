export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border-l-4 border-blue-500">
          <h3 className="text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">150</p>
        </div>
   
      </div>
    </div>
  );
}