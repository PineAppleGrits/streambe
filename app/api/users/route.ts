import prisma from "@/lib/prisma";
import { transformDocument } from "@prisma/client/runtime";
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([{id:1,email:"admin@admin.com"}]);
  const res = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
  return NextResponse.json(res);
}
