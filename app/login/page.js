"use client";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Yahan aap validation add kar sakte hain
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-2xl rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 border rounded-lg focus:outline-blue-500" required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:outline-blue-500" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}