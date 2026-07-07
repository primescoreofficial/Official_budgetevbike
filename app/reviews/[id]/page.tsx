"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ReviewDetailPage() {
    const params = useParams();
    const reviewId = params.id;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-xl text-center border border-zinc-800 bg-zinc-950 p-8 rounded-2xl">
                <span className="text-[#79b947] font-mono text-xs uppercase tracking-widest block mb-2">
                    Review ID: {reviewId}
                </span>
                <h1 className="text-3xl font-extrabold mb-4">Detailed Review Page</h1>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Bhai, yeh Review number {reviewId} ka detail page hai. Yahan par aap bike ke baare mein full in-depth specifications, features aur detailed breakdown likh sakte ho.
                </p>
                <Link href="/" className="inline-block bg-[#79b947] text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#68a33b] transition-colors">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}