import prisma from "@/lib/prisma";
import { transformDocument } from "@prisma/client/runtime";
import { NextResponse } from "next/server";
export async function GET() {
  const res = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
  return NextResponse.json(res);
}
