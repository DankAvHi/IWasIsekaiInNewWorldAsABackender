import { prisma } from "../prisma";
import { getTrendingReposFromGithubApi } from "./getTrendingReposFromGithubApi";

export const syncTrendingReposWithDatabase = async () => {
  try {
    console.log("Syncing trending repos with database...");
    const trendingRepos = await getTrendingReposFromGithubApi();
    if (!trendingRepos) {
      throw new Error("No trending repos found");
    }

    trendingRepos.forEach(async (repo) => {
      await prisma.repo.upsert({
        where: {
          id: repo.id,
        },
        create: repo,
        update: repo,
      });
    });

    console.log("Synced trending repos with database");
    return true;
  } catch (error) {
    console.error("Error when getting trending repos");
    return false;
  }
};
