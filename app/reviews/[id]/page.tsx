"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 1. Aapki pasandida PNG images ka exact path mapping
const fallbackArticles: Record<string, Record<string, string>> = {
    "1": {
        tag: "LAB TEST",
        date: "June 2026",
        title: "BudgetEV Bike: Real-World Performance & Heavy Load City Range Test.",
        // ✅ Ampere folder ke andar 'Ampere Magnus.png' ka exact path
        localImage: "/EV_Bike/Ampere/Ampere Magnus.png",
        description: "Our rigorous multi-stop city road test reveals an exceptionally efficient energy consumption pattern for this commuter bike. Operating under a maximum payload of 160kg, the vehicle’s high-capacity LFP cells consistently manage complex thermal cycles during peak metropolitan traffic, delivering a robust real-world range that aligns perfectly with modern urban demands."
    },
    "2": {
        tag: "VERDICT",
        date: "May 2026",
        title: "Why BudgetEV Bike is the Best Pocket-Friendly Option in 2026.",
        // ✅ Ather Energy folder ke andar 'Anther Energy 450X.png' ka exact path (Aapke file ke naam mein Anther likha hai)
        localImage: "/EV_Bike/Ather Energy/Anther Energy 450X.png",
        description: "A detailed cost-to-ownership analysis firmly establishes this model as India's ultimate budget-friendly EV alternative for 2026. By replacing expensive internal combustion powertrains with a zero-maintenance direct hub motor configuration, running costs drop significantly, allowing daily office commuters to recover their upfront investment within the first few months of ownership."

    },
    "3": {
        tag: "PREVIEW",
        date: "April 2026",
        title: "BudgetEV Bike Detailed Review: High Comfort & Smart Features.",
        // ✅ Atumobile folder ke andar 'Atumobile AtumVader.png' ka exact path
        localImage: "/EV_Bike/Atumobile/Atumobile AtumVader.png",
        description: "While most entry-level electric two-wheelers compromise heavily on rider ergonomics, this detailed review breaks down how this model hits the sweet spot. It seamlessly integrates long-travel telescopic front shocks with an anti-glare smart digital cluster, offering daily city riders a highly premium, fatigue-free commuting ecosystem at an accessible price point."
    }
};

export default function ReviewDetailPage() {
    const params = useParams();
    const reviewId = params?.id ? String(params.id) : "1";
    const [review, setReview] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const cleanId = String(Number(reviewId) % 3 === 0 ? "3" : Number(reviewId) % 3 === 2 ? "2" : "1");
            setReview(fallbackArticles[cleanId] || fallbackArticles["1"]);
            setLoading(false);
        }, 0);
    }, [reviewId]);

    if (loading || !review) {
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

                {/* /* Full Article Text Content */}
                <article className="prose prose-invert max-w-none">

                    {/* 1st Paragraph: Yeh aapka main dynamic description dikhayega (Single Time) */}
                    <p className="text-lg text-zinc-300 leading-relaxed font-normal mb-6 text-justify">
                        {review?.description}
                    </p>

                    {/* 2nd Paragraph: Isme duplicate nahi hoga, balki uske aage ki technical details aayengi */}
                    <p className="text-zinc-400 leading-relaxed mb-6 text-justify">
                        {review?.title?.includes("Real-World Performance") &&
                            "During our advanced track simulation, we actively analyzed the vehicle's braking efficiency and long-term drivetrain reliability under full payload constraints. The internal battery management system (BMS) efficiently throttles power distribution profiles during peak discharge spikes, maintaining cool operating temperatures even when climbing steep flyovers or navigating stop-and-go city traffic. Additionally, the intelligent regenerative braking system actively recaptures kinetic energy during deceleration, safely routing power back into the high-capacity cells to prevent unexpected thermal degradation. This precise software calibration guarantees that daily commuters receive consistent torque delivery and smooth throttle feedback without any noticeable power lag throughout the entire battery cycle."
                        }
                        {review?.title?.includes("Pocket-Friendly") &&
                            "To substantiate our pocket-friendly verdict, our financial analysis tracked local battery grid configurations, charging cycles, and electricity unit consumption metrics against traditional petrol alternatives. By switching from unpredictable fuel prices to an ultra-efficient electric drivetrain, the daily operational cost drops to mere fractions of a rupee per kilometer. Furthermore, the deliberate exclusion of complex multi-speed mechanical gearboxes, drive belts, and liquid coolants guarantees that long-term periodic maintenance expenditures remain practically zero, allowing budget-conscious commuters and delivery partners to maximize their monthly savings from day one while rapidly recovering their initial vehicle investment through cumulative fuel savings."
                        }
                        {review?.title?.includes("High Comfort") &&
                            "During our track simulation, we actively cross-examined the chassis balance under sudden directional changes to evaluate rider fatigue over extended test cycles. The integrated combination of premium telescopic hydraulic front dampers and multi-link active rear suspension works flawlessly together to filter high-frequency road vibrations seamlessly across uneven city tarmac patches, ensuring that deep potholes do not transfer harsh mechanical shocks directly to the rider's spine. To complement this physical comfort, the built-in smart ecosystem features a 7-inch anti-glare primary digital cluster that maintains exceptional visibility under direct afternoon sunlight, natively hosting a zero-latency Bluetooth telemetry network that syncs turn-by-turn navigation data, phone alerts, and real-time state-of-charge (SoC) diagnostic vectors straight to the dashboard interface for an enterprise-grade daily commuting experience."
                        }
                    </p>

                    {/* Specification Note Box */}
                    <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl my-8">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2 text-[#79b947]">Specification Note:</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed text-justify">
                            This layout processes instantaneous hardware responses using dynamic routing vectors. Performance metrics, component stress ratios, vibration damping indexes, and localized thermal profiles were mapped natively inside a controlled environment to maintain 100% deployment speed. All telemetry data, anti-glare lux ratings, and firmware sync cycles are verified locally against 2026 enterprise EV standards.
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
                            India&apos;s most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">{"//"} Quick Links</h4>
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
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">{"//"} Popular Brands</h4>
                        <ul className="space-y-2.5 text-xs font-mono">
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Revotl Motors</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Matter Energy</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Oben Electric</Link></li>
                            <li><Link href="/" className="text-zinc-300 hover:text-[#79b947] transition-colors">Tork Motors</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Form */}
                    <div>
                        <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">{"//"} Contact</h4>
                        <form className="space-y-2" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
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
                        Made for India&apos;s EV Revolution <span className="text-[#79b947]">✦</span>
                    </div>
                </div>

            </div>

        </div >
    );
}