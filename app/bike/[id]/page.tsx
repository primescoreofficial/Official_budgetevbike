'use client';

import React, { useEffect, useState } from 'react';
import { supabase, getBikeImageUrl } from '@/lib/supabase';
import Link from 'next/link';

// ─── LOCAL VEHICLE DATABASE (mirrored from Find-EV page) ───────────────────
interface EVBike {
    id: number;
    name: string;
    brand: string;
    variant: string;
    price: number; // In Lakhs
    battery: string;
    bodyType: 'Hatchback' | 'SUV / MUV' | 'Sedan' | 'Compact' | 'Commuter' | 'Sports' | 'Scooter';
    range: number; // In KM
    chargingTime: number; // In Hours
    image: string;
}

const EV_BIKE_DATABASE: EVBike[] = [
    { id: 1, name: "Revolt RV400", brand: "Revolt Motors", variant: "BRRC PREMIUM STAGE", price: 1.45, battery: "3.24 kWh", bodyType: "Commuter", range: 150, chargingTime: 4.5, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Matter AERA 5000", brand: "Matter Energy", variant: "4-SPEED ACTIVE GEAR", price: 1.74, battery: "5.0 kWh", bodyType: "Sports", range: 125, chargingTime: 5, image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Oben Rorr", brand: "Oben Electric", variant: "LFP HIGH PERFORMANCE", price: 1.50, battery: "4.4 kWh", bodyType: "Sports", range: 187, chargingTime: 2, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Tork Kratos R", brand: "Tork Motors", variant: "ECO SYNC AXIAL", price: 1.68, battery: "4.0 kWh", bodyType: "Commuter", range: 180, chargingTime: 4, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "Ola S1 Pro Gen 2", brand: "Ola Electric", variant: "HYPERDRIVE PERFORMANCE", price: 1.40, battery: "4.0 kWh", bodyType: "Scooter", range: 195, chargingTime: 6.5, image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "Ather 450X Apex", brand: "Ather Energy", variant: "WARP PLUS WARP MODE", price: 1.75, battery: "3.7 kWh", bodyType: "Scooter", range: 157, chargingTime: 5.5, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=400&q=80" }
];

export default function BikeDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bike, setBike] = useState<any | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [similarBikes, setSimilarBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState<string | null>(null);
    const [isLocalData, setIsLocalData] = useState(false);

    useEffect(() => {
        async function fetchBikeDetail() {
            try {
                // 1. Destructure / await params to get the id
                const resolvedParams = params instanceof Promise ? await params : params;
                const targetId = resolvedParams?.id;

                if (!targetId) {
                    setDbError("URL se bike ID nahi mil paayi.");
                    setLoading(false);
                    return;
                }

                const numericId = parseInt(targetId, 10);

                // 2. First check the local EV_BIKE_DATABASE for a matching vehicle
                const localVehicle = EV_BIKE_DATABASE.find(v => v.id === numericId);

                if (localVehicle) {
                    // Found in local dataset — use it directly
                    setBike(localVehicle);
                    setIsLocalData(true);

                    // Get similar vehicles from local array (same bodyType, exclude current)
                    const similar = EV_BIKE_DATABASE.filter(
                        v => v.bodyType === localVehicle.bodyType && v.id !== localVehicle.id
                    );
                    setSimilarBikes(similar.length > 0 ? similar : EV_BIKE_DATABASE.filter(v => v.id !== localVehicle.id).slice(0, 4));
                } else {
                    // 3. Fallback: Fetch from Supabase matching the S.No.
                    const { data, error } = await supabase
                        .from('electric_bikes')
                        .select('*')
                        .eq('"S.No."', numericId)
                        .maybeSingle();

                    if (error) {
                        setDbError(error.message);
                    } else if (data) {
                        setBike(data);
                        setIsLocalData(false);

                        // Fetch Similar Alternative Electric Vehicles based on Segment (Limit 4)
                        const currentSegment = data['Segment'] || 'Mass Market';
                        const { data: recs } = await supabase
                            .from('electric_bikes')
                            .select('*')
                            .eq('Segment', currentSegment)
                            .not('"S.No."', 'eq', numericId)
                            .limit(4);

                        if (recs) setSimilarBikes(recs);

                    } else {
                        setDbError(`Database mein Serial Number ${targetId} ka data nahi mila.`);
                    }
                }
            } catch (err: unknown) {
                setDbError(err instanceof Error ? err.message : "Technical connectivity framework failure.");
            } finally {
                setLoading(false);
            }
        }

        fetchBikeDetail();
    }, [params]);

    if (loading) {
        return (
            <div className="bg-[#0b0c10] min-h-screen text-neutral-300 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#79b947] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#79b947]">LOADING DETAILS...</span>
                </div>
            </div>
        );
    }

    if (dbError || !bike) {
        return (
            <div className="bg-[#0b0c10] min-h-screen text-neutral-300 flex flex-col items-center justify-center p-6 text-center font-sans">
                <h1 className="text-xl font-bold text-red-500 mb-2 font-mono">Oops! Details Not Available</h1>
                <p className="text-neutral-500 text-sm max-w-md font-mono">{dbError}</p>
                <Link href="/" className="mt-4 text-xs text-[#79b947] underline font-mono">Back to Home</Link>
            </div>
        );
    }

    // ─── UNIFIED DATA RESOLVER ─────────────────────────────────────────
    // Maps both local EVBike shape and Supabase row shape to common display variables

    let brandName: string;
    let modelName: string;
    let variantName: string;
    let segmentValue: string;
    let rangeValue: string | number;
    let speedValue: string | number;
    let batteryValue: string | number;
    let bikeId: number;
    let displayPrice: string;
    let finalImageUrl: string;

    if (isLocalData) {
        // ── LOCAL DATA SHAPE ──
        const localBike = bike as EVBike;
        brandName = localBike.brand;
        modelName = localBike.name;
        variantName = localBike.variant;
        segmentValue = localBike.bodyType;
        rangeValue = localBike.range;
        speedValue = 'N/A'; // Local dataset does not have top speed
        batteryValue = localBike.battery;
        bikeId = localBike.id;
        displayPrice = `₹${localBike.price.toFixed(2)} Lakh*`;
        finalImageUrl = localBike.image;
    } else {
        // ── SUPABASE DATA SHAPE ──
        brandName = bike['Brand / OEM'] || bike['Brand/OEM'] || 'Ola Electric';
        modelName = bike['Model Name'] || 'S1X';
        variantName = bike['Variant Name'] || '';
        segmentValue = bike['Segment'] || 'Mass Market';

        rangeValue = bike['Certified Range (km)'] || 'N/A';
        speedValue = bike['Top Speed (km/h)'] || 'N/A';
        batteryValue = bike['Battery Capacity (kWh)'] || 'N/A';
        bikeId = bike['S.No.'] || 1;

        // 💰 PURE DYNAMIC PRICE RESOLVER (Matches homepage dynamic mapping)
        const range = Number(bike['Certified Range (km)']) || 0;
        const topSpeed = Number(bike['Top Speed (km/h)']) || 0;
        const battery = Number(bike['Battery Capacity (kWh)']) || 2;

        let estimatedPrice = 80000 + (range * 300) + (topSpeed * 400) + (battery * 5000);
        estimatedPrice = Math.round(estimatedPrice / 1000) * 1000;
        displayPrice = `₹${estimatedPrice.toLocaleString('en-IN')}*`;

        // 📸 TRUE HOME CARD IMAGE RESOLVER PATH
        finalImageUrl = getBikeImageUrl(brandName, modelName);
        if (brandName === 'Ola Electric') {
            const checkStr = `${brandName} ${modelName} ${variantName}`.toLowerCase();
            if (checkStr.includes('s1 air')) {
                finalImageUrl = '/EV_Bike/Ola Electric/Ola Electric S1 Air.png';
            } else if (checkStr.includes('s1 pro')) {
                finalImageUrl = '/EV_Bike/Ola Electric/Ola Electric S1 Pro.png';
            } else if (checkStr.includes('s1x+') || checkStr.includes('s1 x+')) {
                finalImageUrl = '/EV_Bike/Ola Electric/Ola Electric S1X+.png';
            } else if (checkStr.includes('s1x') || checkStr.includes('s1 x')) {
                finalImageUrl = '/EV_Bike/Ola Electric/Ola Electric S1X.avif';
            }
        }
    }

    return (
        <div className="bg-[#0b0c10] min-h-screen text-neutral-200 font-sans antialiased flex flex-col justify-between">

            {/* Main Content Wrapper */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 w-full flex-grow">

                {/* Navigation Breadcrumbs */}
                <p className="text-neutral-500 text-[11px] font-mono uppercase tracking-wider mb-6 flex items-center gap-1.5">
                    <Link href="/" className="hover:text-[#79b947] transition-colors">Home</Link>
                    <span className="text-neutral-700">/</span>
                    <Link href="/Find-EV" className="hover:text-[#79b947] transition-colors">Find-EV</Link>
                    <span className="text-neutral-700">/</span>
                    <span className="text-[#79b947] font-bold">{brandName} {modelName}</span>
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

                    {/* LEFT PANEL: TRUE BIKE CARD IMAGE LOCATION */}
                    <div className="lg:col-span-7">
                        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[360px] md:min-h-[440px] shadow-xl relative group">
                            <img
                                src={finalImageUrl}
                                alt={`${brandName} ${modelName}`}
                                className="max-h-[280px] md:max-h-[350px] object-contain transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    const projectID = 'bwneyzbsohxwlgdludby';
                                    e.currentTarget.src = `https://${projectID}.supabase.co/storage/v1/object/public/bikes/${bikeId}.png`;
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT PANEL: FULL SPEC SHEET DETAILS */}
                    <div className="lg:col-span-5 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
                        <div>
                            <span className="text-[#79b947] text-[10px] font-mono font-bold uppercase tracking-widest block bg-[#79b947]/10 border border-[#79b947]/20 w-fit px-2.5 py-1 rounded-md mb-2">
                                {segmentValue}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                {brandName} {modelName}
                                {variantName && <span className="text-sm font-medium text-neutral-400 block mt-1">{variantName}</span>}
                            </h1>
                        </div>

                        {/* Technical Specs Data Matrix */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-b border-neutral-800 py-6 font-mono">
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">⚡ CERTIFIED RANGE</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {rangeValue !== 'N/A' && !String(rangeValue).includes('km') ? `${rangeValue} km` : rangeValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🏁 TOP SPEED</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {speedValue !== 'N/A' && !String(speedValue).includes('km/h') ? `${speedValue} km/h` : speedValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🔋 BATTERY CAPACITY</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {batteryValue !== 'N/A' && !String(batteryValue).includes('kWh') ? `${batteryValue} kWh` : batteryValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🆔 SERIAL NUMBER</span>
                                <span className="text-white text-sm font-bold mt-1 block"># {bikeId}</span>
                            </div>
                            {isLocalData && (
                                <div>
                                    <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">⏱️ CHARGING TIME</span>
                                    <span className="text-white text-sm font-bold mt-1 block">{(bike as EVBike).chargingTime} hrs</span>
                                </div>
                            )}
                        </div>

                        {/* 100% Dynamic Calculated Price Box */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Estimated Price</span>
                                <span className="text-2xl font-black text-white mt-0.5 block">
                                    {displayPrice}
                                </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wide border border-neutral-800 rounded px-2 py-1 bg-neutral-950">
                                EX-SHOWROOM
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-2">
                            <Link href={`/compare?id=${bikeId}`} className="w-full text-center block">
                                <button className="w-full bg-[#79b947] hover:bg-[#68a33b] text-neutral-950 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md font-mono">
                                    Compare {modelName}
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* ========================================================= */}
                {/* 📝 SECTION: ABOUT THIS VEHICLE */}
                {/* ========================================================= */}
                <div className="border-t border-neutral-900/60 pt-10 mb-12">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">About This Vehicle</h2>
                    <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 mt-4 font-mono text-xs text-neutral-400 leading-relaxed max-w-4xl">
                        <p>
                            The <span className="text-white font-bold">{brandName} {modelName} {variantName}</span> is engineered for optimal performance in urban commuting. Equipped with advanced smart connectivity features, robust battery management systems, and high efficiency, it stands out as a reliable choice in the {segmentValue} electric vehicle segment.
                        </p>
                        <p className="mt-3">
                            With a certified range of <span className="text-[#79b947] font-bold">{rangeValue}{typeof rangeValue === 'number' ? ' km' : ''}</span> and a top speed of <span className="text-[#79b947] font-bold">{speedValue}{typeof speedValue === 'number' ? ' km/h' : ''}</span>, this model ensures a cost-effective, eco-friendly drive experience, requiring minimal maintenance while maximizing energy output via its <span className="text-white font-bold">{batteryValue}</span> power unit configuration.
                        </p>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* SECTION: SIMILAR ELECTRIC VEHICLES */}
                {/* ========================================================= */}
                <div className="border-t border-neutral-900/60 pt-10 mb-16">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Similar Electric Vehicles</h2>
                    <p className="text-neutral-500 text-xs mt-1 mb-6 font-mono">Compare alternatives with similar pricing, range, body style, and features.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {similarBikes && similarBikes.length > 0 ? similarBikes.map((sb) => {

                            if (isLocalData) {
                                // ── Render similar card from LOCAL data ──
                                const localSb = sb as EVBike;
                                return (
                                    <div key={localSb.id} className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-neutral-700/80 transition-all">
                                        <div className="flex items-center justify-center bg-neutral-950/40 rounded-lg p-3 min-h-[140px] mb-3">
                                            <img
                                                src={localSb.image}
                                                className="max-h-[100px] object-contain"
                                                alt={`${localSb.brand} ${localSb.name}`}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white truncate">{localSb.brand} {localSb.name}</h3>
                                            <p className="text-[11px] font-mono text-[#79b947] mt-0.5">{localSb.variant}</p>
                                            <p className="text-xs font-mono font-bold text-neutral-400 mt-2">₹{localSb.price.toFixed(2)} Lakh*</p>
                                        </div>
                                        <Link href={`/bike/${localSb.id}`} className="mt-4 w-full text-center bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-[11px] py-2 rounded-md tracking-wide transition-colors block">
                                            View Details
                                        </Link>
                                    </div>
                                );
                            }

                            // ── Render similar card from SUPABASE data ──
                            const sId = sb['S.No.'];
                            const sRange = Number(sb['Certified Range (km)']) || 0;
                            const sSpeed = Number(sb['Top Speed (km/h)']) || 0;
                            const sBattery = Number(sb['Battery Capacity (kWh)']) || 2;
                            let sPriceCalc = 80000 + (sRange * 300) + (sSpeed * 400) + (sBattery * 5000);
                            sPriceCalc = Math.round(sPriceCalc / 1000) * 1000;

                            return (
                                <div key={sId} className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-neutral-700/80 transition-all">
                                    <div className="flex items-center justify-center bg-neutral-950/40 rounded-lg p-3 min-h-[140px] mb-3">
                                        {(() => {
                                            const sBrand = sb['Brand / OEM'] || sb['Brand/OEM'] || '';
                                            const sModel = sb['Model Name'] || '';
                                            const sVariant = sb['Variant Name'] || '';
                                            let sImg = getBikeImageUrl(sBrand, sModel);
                                            if (sBrand === 'Ola Electric') {
                                                const checkStr = `${sBrand} ${sModel} ${sVariant}`.toLowerCase();
                                                if (checkStr.includes('s1 air')) {
                                                    sImg = '/EV_Bike/Ola Electric/Ola Electric S1 Air.png';
                                                } else if (checkStr.includes('s1 pro')) {
                                                    sImg = '/EV_Bike/Ola Electric/Ola Electric S1 Pro.png';
                                                } else if (checkStr.includes('s1x+') || checkStr.includes('s1 x+')) {
                                                    sImg = '/EV_Bike/Ola Electric/Ola Electric S1X+.png';
                                                } else if (checkStr.includes('s1x') || checkStr.includes('s1 x')) {
                                                    sImg = '/EV_Bike/Ola Electric/Ola Electric S1X.avif';
                                                }
                                            }
                                            return (
                                                <img
                                                    src={sImg}
                                                    className="max-h-[100px] object-contain"
                                                    alt={`${sb['Brand / OEM'] || ''} ${sb['Model Name'] || ''}`}
                                                    onError={(e) => {
                                                        const current = e.currentTarget.src;
                                                        // Loop rokne ke liye check lagaya hai
                                                        if (!current.includes('stop=true')) {
                                                            // Agar main URL kaam na kare toh local standard folder try karega
                                                            const bName = String(sb['Brand / OEM'] || '').trim();
                                                            const mName = String(sb['Model Name'] || '').trim();
                                                            e.currentTarget.src = `/EV_Bike/${bName}/${mName}.png?stop=true`;
                                                        } else {
                                                            // Agar dono jagah na mile toh layout kharab hone ke bajay broken icon gayab ho jayega
                                                            e.currentTarget.style.display = 'none';
                                                        }
                                                    }}
                                                />
                                            );
                                        })()}

                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-white truncate">{sb['Brand / OEM'] || sb['Brand/OEM']} {sb['Model Name']}</h3>
                                        <p className="text-[11px] font-mono text-[#79b947] mt-0.5">{sb['Variant Name'] || `${sb['Battery Capacity (kWh)']} kWh`}</p>
                                        <p className="text-xs font-mono font-bold text-neutral-400 mt-2">₹{sPriceCalc.toLocaleString('en-IN')}*</p>
                                    </div>
                                    <Link href={`/bike/${sId}`} className="mt-4 w-full text-center bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-[11px] py-2 rounded-md tracking-wide transition-colors block">
                                        View Details
                                    </Link>
                                </div>
                            );
                        }) : (
                            <div className="col-span-4 text-center py-6 border border-dashed border-neutral-800 rounded-xl text-neutral-600 text-xs font-mono">No similar alternative vehicles found matching this segment range.</div>
                        )}
                    </div>
                </div>

            </div> {/* Main Content Wrapper Ends */}

            {/* ========================================================= */}
            {/* 🌟 EXACT MATCHED 4-COLUMN FOOTER COMPONENT */}
            {/* ========================================================= */}
            <footer className="w-full bg-neutral-950 border-t border-neutral-900/80 py-12 text-neutral-400 font-mono text-xs mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* COLUMN 1 */}
                    <div className="md:col-span-4 flex flex-col gap-3">
                        <div className="text-white font-black tracking-tighter text-base uppercase flex items-center gap-1">
                            EV<span className="text-[#79b947]">.BIKE</span>
                        </div>
                        <p className="text-neutral-500 leading-relaxed max-w-sm text-[11px]">
                            India&apos;s most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
                        </p>
                    </div>

                    {/* COLUMN 2 */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">{"//"} QUICK LINKS</span>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Home</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Comparison</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Brands</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">EV Calculator</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Find-EV</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Charging Stations</Link>
                    </div>

                    {/* COLUMN 3 */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">{"//"} POPULAR BRANDS</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Revolt Motors</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Matter Energy</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Oben Electric</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Tork Motors</span>
                    </div>

                    {/* COLUMN 4 */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">{"//"} CONTACT SUPPORT</span>
                        <p className="text-neutral-300 font-bold">+91 63506-71636</p>
                        <a href="mailto:info@evbike.com" className="hover:text-[#79b947] transition-colors text-neutral-400 break-all">info@evbike.com</a>
                    </div>

                </div>

                {/* COPYRIGHT TRACK */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-neutral-900/60 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-600 gap-2">
                    <p>© 2026 EV.BIKE MATRIX MEDIA. ALL RIGHTS RESERVED.</p>
                    <p className="tracking-widest uppercase text-neutral-500 text-[9px]">MADE FOR INDIA&apos;S EV REVOLUTION</p>
                </div>
            </footer>

        </div>
    );
}