import { prisma } from "../prisma";

export const getTrendingRepos = async () => {
  return await prisma.repo.findMany();
};
