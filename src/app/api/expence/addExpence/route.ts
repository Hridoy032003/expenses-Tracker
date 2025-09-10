

import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';




const expenseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Use YYYY-MM-DD." }),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

   
    const validationResult = expenseSchema.safeParse(body);

    if (!validationResult.success) {
     
      console.error("Validation Errors:", validationResult.error);
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

   
    const validatedData = validationResult.data;
  const expenseDate = new Date(`${validatedData.date}T00:00:00.000Z`);

    // Check if the parsed date is valid
    if (isNaN(expenseDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date value after parsing." },
        { status: 400 }
      );
    }
  const session = await getAuthSession();
  if(!session){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  }

    


    

    // 4. Create the expense record using Prisma
    const newExpense = await db.expence.create({
      data: {
        title: validatedData.title,
        amount: validatedData.amount,
        
        date: expenseDate,
        category: validatedData.category,
        userId: session?.user.id, 
        description: validatedData.description,
      },
    });

    
    return NextResponse.json({ message: "Expense created successfully", expense: newExpense }, { status: 201 });

  } catch (error) {
   
    console.error("Error in POST /api/expenses:", error);

    
    if (error instanceof Error) {
       return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
       
       return NextResponse.json({ message: "An unexpected error occurred", error: "Unknown error" }, { status: 500 });
    }
  } 
}
