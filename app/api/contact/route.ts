import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        // Frontend se user ka data receive karna
        const { name, email, message } = await request.json();

        // 1. Gmail configuration (Postman Setup)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // IMPORTANT: Yahan apni official/system Gmail ID daalna jiske throug mail jayega
                user: "24aiml26@gweca.ac.in",
                // IMPORTANT: Yahan apna 16-digit App Password daalna (bina spaces ke)
                pass: "mkkd xrqj vadc hhxs",
            },
        });

        // 2. Mail ka Format tay karna (Direct Founder ke Paas bhejna)
        const mailOptions = {
            from: `"EV.BIKE Website" <info@evbike.com>`, // Send karne wala server
            to: "24aiml26@gweca.ac.in",       // <-- YAHAN APNE FOUNDER KI REAL GMAIL ID DAALO!
            replyTo: email,                              // Founder direct reply karega toh user ko jayega
            subject: `🚨 New EV.BIKE Query from ${name}`,
            text: `Aapki website par ek naya message aaya hai:\n\n` +
                `----------------------------------------\n` +
                `👤 Name: ${name}\n` +
                `📧 Email: ${email}\n` +
                `📝 Message:\n${message}\n` +
                `----------------------------------------`,
        };

        // 3. Mail Send karna (Bina kisi 3rd party tool ke)
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Mail sent successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Mailer Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}