import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-theme_gray">
      <div className="flex flex-col gap-[5vh] items-center justify-center">
        <h1 className="text-white text-3xl">Co Working Space</h1>
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Register
          </Link>
          <Link
            href="/home"
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
