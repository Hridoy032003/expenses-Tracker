// /pages/api/categoryData.ts

import { db } from "@/lib/db";  // Your Prisma db import

export async function GET() {
  try {
    // Query to get total amount spent per category
    const categoryData = await db.expence.groupBy({
      by: ['category'],
      _sum: {
        amount: true
      }
    });

    // Format the data for the front-end
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
