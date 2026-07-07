"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 1. Aapki pasandida PNG images ka exact path mapping
const fallbackArticles: Record<string, any> = {
    "1": {
        tag: "LAB TEST",
        date: "June 2026",
        title: "BudgetEV Bike: Real-World Performance & Heavy Load City Range Test.",
        // ✅ Ampere folder ke andar 'Ampere Magnus.png' ka exact path
        localImage: "/EV_Bike/Ampere/Ampere Magnus.png",
        description: "We put this budget-friendly electric vehicle through an extensive range test across heavy city traffic, steep flyovers, and varied road surfaces to evaluate its practical utility, suspension limits, and actual battery efficiency under real-world load conditions."
    },
    "2": {
        tag: "VERDICT",
        date: "May 2026",
        title: "Why BudgetEV Bike is the Best Pocket-Friendly Option in 2026.",
        // ✅ Ather Energy folder ke andar 'Anther Energy 450X.png' ka exact path (Aapke file ke naam mein Anther likha hai)
        localImage: "/EV_Bike/Ather Energy/Anther Energy 450X.png",
        description: "Navigating daily office commutes without burning a hole in your pocket can be challenging. In this detailed review, we look at why this commuter-focused electric vehicle stands out as India's ultimate budget alternative for 2026, combining extremely low running costs with a highly robust daily utility layout."

    },
    "3": {
        tag: "PREVIEW",
        date: "April 2026",
        title: "BudgetEV Bike Detailed Review: High Comfort & Smart Features.",
        // ✅ Atumobile folder ke andar 'Atumobile AtumVader.png' ka exact path
        localImage: "/EV_Bike/Atumobile/Atumobile AtumVader.png",
        description: "While budget electric scooters often compromise on rider ergonomics and modern tech, this detailed analysis breaks down how this vehicle strikes a perfect balance. We dive deep into its advanced digital instrument console, smart connectivity features, and a plush suspension layout engineered specifically to handle broken Indian city roads with maximum comfort. "
    }
};

export default function ReviewDetailPage() {
    const params = useParams();
    const reviewId = params?.id ? String(params.id) : "1";
    const [review, setReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cleanId = String(Number(reviewId) % 3 === 0 ? "3" : Number(reviewId) % 3 === 2 ? "2" : "1");
        setReview(fallbackArticles[cleanId] || fallbackArticles["1"]);
        setLoading(false);
    }, [reviewId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm">
                Loading Full Article...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-zinc-100 py-16 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#79b947] text-sm mb-10 transition-colors">
                    &larr; Back to Home
                </Link>

                {/* Article Meta */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-2.5 py-1 bg-[#79b947]/10 text-[#79b947] text-xs font-mono font-bold uppercase rounded border border-[#79b947]/20">
                        {review.tag}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">{review.date}</span>
                </div>

                {/* Article Full Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight text-balance">
                    {review.title}
                </h1>

                {/* Big Article Banner - Rendering Exact Local PNG Image */}
                <div className="aspect-[16/9] w-full bg-zinc-900 border border-zinc-800 rounded-2xl mb-10 overflow-hidden flex items-center justify-center relative">
                    <Image
                        src={review.localImage}
                        alt={`${review.tag} Technical View`}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay text for sleek look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                        <div className="w-full text-center">
                            <span className="font-mono text-xs tracking-widest text-[#79b947]/80 uppercase mb-2 block">{review.tag} VISUAL</span>
                            <span className="text-[10px] uppercase text-zinc-300">EV Brand Asset System</span>
                        </div>
                    </div>
                </div>

                {/* Full Article Text Content */}
                <article className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-300 leading-relaxed font-normal mb-6 text-justify">
                        {review.description}
                    </p>

                    <p className="text-zinc-400 leading-relaxed mb-6 text-justify">
                        Humne is model ke automotive design aur actual performance metrics ko verify kiya hai. PNG format ke high-resolution images ko direct local folders (`/public/EV_Bike/`) se pull karne ke baad yeh component bina kisi delay ke page par ekdum crisp aur clean load ho raha hai.
                    </p>

                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl my-8">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2 text-[#79b947]">Specification Note:</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Yeh images bina kisi internet network dependency ke seedha local file management system se load ho rahi hain, jo browser loading speed ko super fast banati hain.
                        </p>
                    </div>
                </article>

            </div>

            {/* ⬇️ CLEAN PREMIUM FOOTER CODES PASTE HERE ⬇️ */}
            <div className="mt-24 -mx-6 md:-mx-12 lg:-mx-16 border-t border-zinc-900 bg-[#0a0f12]/40 pt-16 px-6 md:px-12 lg:px-16">

                {/* Main Footer Links and Form Grid */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">

                    {/* Column 1: Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-black text-lg tracking-tighter italic">EV.<span className="text-[#79b947]">BIKE</span></span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                            India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">// Quick Links</h4>
                        <ul className="space-y-2.5 text-xs font-mono">
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Home</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Comparison</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Brands</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">EV Calculator</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Find-EV</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Charging Stations</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Brands */}
                    <div>
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">// Popular Brands</h4>
                        <ul className="space-y-2.5 text-xs font-mono">
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Revotl Motors</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Matter Energy</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Oben Electric</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Tork Motors</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Form */}
                    <div>
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">// Contact</h4>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Name *"
                                className="w-full bg-[#162229]/40 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#79b947]"
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                className="w-full bg-[#162229]/40 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#79b947]"
                            />
                            <textarea
                                rows={2}
                                placeholder="Query / Message *"
                                className="w-full bg-[#162229]/40 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#79b947] resize-none"
                            ></textarea>
                            <button className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-[11px] py-2 rounded uppercase tracking-wider transition-colors">
                                Submit Message
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Copyright Bar */}
                <div className="max-w-6xl mx-auto py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    <div>
                        &copy; {new Date().getFullYear()} EV.BIKE MATRIX MEDIA. All Rights Reserved.
                    </div>
                    <div className="text-zinc-500 flex items-center gap-1">
                        Made for India's EV Revolution <span className="text-[#79b947]">✦</span>
                    </div>
                </div>

            </div>

        </div >
    );
}