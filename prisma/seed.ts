import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  try{
    const user = await prisma.user.findUnique({where: { email: "admin@admin.com" }});
    if(!user)  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    //@ts-ignore
    update: {},
    create: {
      email: "admin@admin.com",
      password: await hash("admin1234", 10),
      isAdmin: true,
    },
  });
  }
  catch (err){console.error(err)}
    }
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
