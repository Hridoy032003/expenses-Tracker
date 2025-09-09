import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { generateNumericOTP } from "@/utils/otp";
import { sendMail } from "@/lib/mail";

export async function POST(request: NextRequest,response: NextResponse) {
  try {
    const { email, name, password, conformPassword, image, userOtp } = await request.json();

  if (password !== conformPassword) {
   return new Response("Passwords do not match", { status: 400 });
  }
  if (!image) {
      return new Response("Image is required", { status: 400 });
  }
    if (!email || !password || !name) {
       return new Response("Missing required fields", { status: 400 });
    }
   const existingUser = await db.user.findUnique({
        where: { email },
    });
    if (existingUser) {
       return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //otp generation
    const otp = generateNumericOTP();
    await sendMail(email, otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const saveOtp = await db.emailVerifiedToken.create({
        data: {
            identifier: email,
            token: hashedOtp,
        },
    });
   const getOtp=await db.emailVerifiedToken.findFirst({
        where: { identifier: email },
        orderBy: { createdAt: 'desc' },
    });
    const decryptOtp=await bcrypt.compare(userOtp,getOtp?.token||"");
    if(!decryptOtp){
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    const createUser= await db.user.create({
        data: {
            email,
            username: name,
            hashedPassword,
            image,
        },
    });
    return NextResponse.json({ message: "User created successfully", createUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}