import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: {
      username: 'admin',
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: '93e0081fba7d633c53b1e4cf49b360f7',
        scopes: {
          create: {
            scope: {
              create: {
                name: 'portal',
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    console.log('save user done :::');
    return;
  }
  console.log('has admin user :::', !!user, 'do not need add admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
