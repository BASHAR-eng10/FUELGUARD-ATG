import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient()
  .$extends(withAccelerate());

// fetch nozzles
const nozzles = async () => {
	const result = await prisma.nozzle.findMany();
	return result;
};
nozzles()
  .then(async (data) => {
    console.log(data);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

