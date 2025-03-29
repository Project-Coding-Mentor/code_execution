import frontpage from "../../public/front.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <div
        className="flex justify-center items-center h-screen bg-gray-100"
        style={{
          backgroundImage: `url(${frontpage.src})`, // Correctly set the background image
          backgroundSize: "cover", // Ensure the image covers the entire container
          backgroundPosition: "center", // Center the image
        }}
      >
        <Link
          href="/UserDashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 relative top-18 left-60"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
