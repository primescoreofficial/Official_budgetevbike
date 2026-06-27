'use client';

import { ArrowLeft, BookOpen, Star, MessageSquareCode, ShieldCheck } from 'lucide-react';

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      tag: "LAB TEST",
      date: "JUNE 2026",
      title: "In-Depth: Real-world range test of the latest urban high-speed electric scooters.",
      excerpt: "We push the limits on Indian city roads to see if advertised specifications live up to reality under heavy traffic conditions.",
      rating: 4.8,
      author: "Rajesh Kumar",
      readTime: "6 min read"
    },
    {
      id: 2,
      tag: "VERDICT",
      date: "MAY 2026",
      title: "Revolt RV400 vs Ather 450X: The ultimate commuter battle.",
      excerpt: "A classic showdown between performance-oriented electric scooters and motorcycle form-factors for daily office travel.",
      rating: 4.7,
      author: "Aditi Sharma",
      readTime: "8 min read"
    },
    {
      id: 3,
      tag: "PREVIEW",
      date: "APRIL 2026",
      title: "Next-gen battery tech and thermal management arriving next quarter.",
      excerpt: "An exclusive technical analysis of solid-state developments coming to high-performance two-wheelers.",
      rating: 4.9,
      author: "Vikram Malhotra",
      readTime: "5 min read"
    },
    {
      id: 4,
      tag: "LONG TERM",
      date: "MARCH 2026",
      title: "6 Months with the Ola S1 Pro: A daily driver report card.",
      excerpt: "Our long-term review examines software stability, battery degradation, and build quality after 5,000 km of city riding.",
      rating: 4.5,
      author: "Sanjay Dutta",
      readTime: "10 min read"
    },
    {
      id: 5,
      tag: "FIRST RIDE",
      date: "FEBRUARY 2026",
      title: "Matter Aera 5000: Riding India's first geared electric motorcycle.",
      excerpt: "Does a 4-speed manual gearbox make sense on an electric motorcycle? We take the Matter Aera for a spin on the track.",
      rating: 4.6,
      author: "Arjun Mehta",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="ev.BIKE Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-black tracking-tighter uppercase">
              ev.<span className="text-[#79b947]">bike</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            <a href="/" className="text-neutral-400 hover:text-white transition-colors">Home</a>
            <a href="/compare" className="text-neutral-400 hover:text-white transition-colors">Comparison</a>
            <a href="/brands" className="text-neutral-400 hover:text-white transition-colors">Brands</a>
            <a href="/calculator" className="text-neutral-400 hover:text-white transition-colors">EV Calculator</a>
            <a href="/reviews" className="text-white border-b border-white/40 pb-0.5">Reviews</a>
            <a href="/charging-stations" className="text-neutral-400 hover:text-white transition-colors">Charging Stations</a>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <span className="text-[#79b947] font-mono text-[10px] uppercase tracking-[0.2em] mb-3 block">// Editorial</span>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Expert Reviews</h1>
          <p className="text-neutral-500 text-sm mt-1">In-depth technical evaluations, range tests, and road comparison verdicts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <article key={r.id} className="group bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 py-0.5 bg-[#79b947]/10 text-[#79b947] text-[9px] font-mono font-bold uppercase rounded">{r.tag}</span>
                  <span className="text-neutral-600 text-[9px] font-mono">{r.date}</span>
                </div>

                <h3 className="text-xl font-bold group-hover:text-[#79b947] transition-colors leading-snug mb-3">
                  {r.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                  {r.excerpt}
                </p>
              </div>

              <div className="border-t border-neutral-800/80 pt-4 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                <div className="flex items-center gap-1">
                  <Star className="size-3 text-[#79b947] fill-[#79b947]" />
                  <span className="font-bold text-neutral-300">{r.rating} / 5.0</span>
                </div>
                <span>{r.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 🌟 START: CLEAN MANUAL FOOTER */}
      <footer className="w-full bg-neutral-950 text-neutral-400 font-sans border-t border-neutral-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Column 1: About Platform */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                ev.<span className="text-[#79b947]">bike</span>
              </span>
            </div>
            <p className="text-neutral-500 text-xs font-medium leading-relaxed">
              India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// QUICK LINKS</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="/" className="hover:text-[#79b947] transition-colors">New Bikes</a></li>
              <li><a href="/compare" className="hover:text-[#79b947] transition-colors">Comparison</a></li>
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Brands</a></li>
              <li><a href="/calculator" className="hover:text-[#79b947] transition-colors">EV Calculator</a></li>
              <li><a href="/reviews" className="hover:text-[#79b947] transition-colors">Reviews</a></li>
              <li><a href="/charging-stations" className="hover:text-[#79b947] transition-colors">Charging Stations</a></li>
            </ul>
          </div>

          {/* Column 3: Popular Brands */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// POPULAR BRANDS</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Revolt Motors</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Matter Energy</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Oben Electric</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Tork Motors</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// CONTACT SUPPORT</h4>
            <div className="space-y-1.5 text-xs font-semibold text-neutral-400">
              <p className="text-white font-bold text-[13px]">+91 63505-71635</p>
              <p className="text-neutral-500">
                <a href="mailto:info@evbike.com" className="hover:text-[#79b947] transition-colors">info@evbike.com</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
          <div>© 2026 EV.BIKE MATRIX MEDIA. ALL RIGHTS RESERVED.</div>
          <div className="text-neutral-500 font-sans font-bold">MADE FOR INDIA'S EV REV</div>
        </div>
      </footer>

    </div>
  );
}
