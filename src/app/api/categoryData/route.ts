// /pages/api/categoryData.ts

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";  // Your Prisma db import

export async function GET() {
  try {
const session = await getAuthSession();
const categoryData=await db.expence.groupBy({
    where: {
    userId: session?.user?.id,
  },
  by: ['category'],
  _sum: {
    amount: true
  }
});
    
    const formattedCategoryData = categoryData.map((data) => ({
      category: data.category,
      amount: data._sum.amount || 0,
    }));

    return new Response(JSON.stringify({ categories: formattedCategoryData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error fetching category data" }), {
      status: 500,
    });
  }
}
