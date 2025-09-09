import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
   try {
    const session = await getAuthSession();
   if(!session){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  }
  const findallEntrys= await db.user.findUnique({
    where: {
        id: session.user.id,
    },
    include: {
        Expences: true,
    },
});
  return NextResponse.json(findallEntrys);
   } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    
   }
}