'use client';

import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">MyApp</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/Questions" className="hover:underline">
            Questions
          </Link>
          <Link href="/UserDashboard" className="hover:underline">
            User Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;