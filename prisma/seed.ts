import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@booking.io' },
    update: {},
    create: {
      email: 'alice@booking.io',
      // 123456
      password: '$2b$10$3foEDljL9Akv3vVZ.HLsSuEOWX2kcNhhAZkyN4azX9KXLK8P5MQ.q',
      name: 'Alice Admin',
      roles: ['ADMIN'],
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@booking.io' },
    update: {},
    create: {
      email: 'bob@booking.io',
      // 123456
      password: '$2b$10$3foEDljL9Akv3vVZ.HLsSuEOWX2kcNhhAZkyN4azX9KXLK8P5MQ.q',
      name: 'Bob Customer',
    },
  });
  console.log({ alice, bob });
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
