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
        password:
          'ade07a952dc602a3514ebeb83ec8aa36:adfa025aaa1e4b1ded169dda56a9df95',
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
