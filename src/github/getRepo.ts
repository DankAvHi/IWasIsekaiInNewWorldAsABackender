import { prisma } from "../prisma";

export const getRepo = async (nameOrId: string | number) => {
  if (typeof nameOrId === "number") {
    return await prisma.repo.findUnique({
      where: {
        id: nameOrId,
      },
    });
  }

  return await prisma.repo.findUnique({
    where: {
      name: nameOrId,
    },
  });
};
