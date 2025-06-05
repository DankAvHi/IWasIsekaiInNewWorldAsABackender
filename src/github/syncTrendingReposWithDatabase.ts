import { prisma } from "../prisma";
import { getTrendingReposFromGithubApi } from "./getTrendingReposFromGithubApi";

export const syncTrendingReposWithDatabase = async () => {
  try {
    console.log("Syncing trending repos with database...");
    const trendingRepos = await getTrendingReposFromGithubApi();
    console.log("Got trending repos from github api");
    if (!trendingRepos) {
      throw new Error("No trending repos found");
    }

    const existingRepos = await prisma.repo.findMany();
    console.log("Got existing repos from database");
    const existingRepoNames = existingRepos.map((repo) => repo.name);
    const updatedRepos = trendingRepos.filter((repo) =>
      existingRepoNames.includes(repo.name)
    );
    const updatedReposNames = updatedRepos.map((repo) => repo.name);

    const newRepos = trendingRepos.filter(
      (repo) => !existingRepoNames.includes(repo.name)
    );
    console.log("Updating Database repos...");
    for (const repoToUpdate of updatedRepos) {
      const { name, ...dataToUpdate } = repoToUpdate;
      await prisma.repo.update({
        where: { name: name },
        data: dataToUpdate,
      });
    }
    console.log("Creating new repos in Database...");

    await prisma.repo.createMany({
      data: newRepos,
    });

    console.log("Synced trending repos with database");
    return true;
  } catch (error) {
    console.error(`Error when getting trending repos: ${error}`);
    return false;
  }
};
