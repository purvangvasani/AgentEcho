// app/not-found.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-900 rounded-xl px-10 py-12 flex flex-col items-center max-w-md w-full">
                <div className="mb-8">
                    <Image
                        src={"/page-404.svg"}
                        alt="Logo"
                        width={300}
                        height={300}
                        priority
                    />
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">404</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center">The page you are looking for does not exist.</p>
                <Link href="/">
                    <button className="px-6 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black font-semibold shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Go Home</button>
                </Link>
            </div>
        </div>
    );
}

