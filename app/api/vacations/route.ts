import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { start, end, color, userId, days } = await req.json();
  
  if (userId == undefined) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  } else {
    const c = Array.from(
      new Set(
        (
          await prisma.vacation.findMany({
            where: {
              userId,
            },
            include: {
              vacationDays: true,
            },
          })
        ).flatMap((e) => e.vacationDays.flatMap(({ id }: { id: Date }) => id.toDateString()))
      )
    );
    const availableDays = days.filter((e: string) => !c.includes(new Date(e).toDateString()));
    //@ts-ignore
    if (availableDays.length < 1) return NextResponse.json({ error: "Invalid days" }, { status: 400 });
    // if (c.length < 1) return NextResponse.json({ error: "Invalid days" }, { status: 400 });
    try {
      const vacation = await prisma.vacation.create({
        data: {
          color: color,
          userId,
          vacationDays: {
            connectOrCreate: availableDays.map((id: Date) => ({ where: { id }, create: { id } })),
          },
        },
        include: {
          vacationDays: true,
        },
      });
      return NextResponse.json(vacation);
    } catch (err) {
      console.error(err);
    }
  }
}

export async function GET() {
  const res = (
    await prisma.date.findMany({
      include: {
        vacations: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    })
  ).filter((e) => e.vacations.length > 0);
  return NextResponse.json(res);
}
