import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
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
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
