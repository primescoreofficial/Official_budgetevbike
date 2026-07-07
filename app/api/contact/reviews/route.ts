import { NextResponse } from "next/server";

export async function GET() {
    // Yeh aapke 3 reviews ki list hai. Kal ko text badalna ho toh bas yahan badalna.
    const reviews = [
        {
            id: 1,
            tag: "LAB TEST",
            date: "June 2026",
            title: "BudgetEV Bike: Real-World Performance & Heavy Load City Range Test.",
            description: "Humne is budget electric bike ko bhari traffic aur alag-alag roads par test kiya hai taaki iski asli range aur top speed ka pata chal sake."
        },
        {
            id: 2,
            tag: "VERDICT",
            date: "May 2026",
            title: "Why BudgetEV Bike is the Best Pocket-Friendly Option in 2026.",
            description: "Low maintenance costs aur behtareen battery backup ke sath ye bike daily office aur market aane-jaane ke liye sabse best verdict banti hai."
        },
        {
            id: 3,
            tag: "PREVIEW",
            date: "April 2026",
            title: "BudgetEV Bike Detailed Review: High Comfort & Smart Features.",
            description: "Is price range mein digital console, anti-theft alarm aur smooth suspension jaise premium features ka unedited expert breakdown."
        }
    ];

    return NextResponse.json(reviews);
}