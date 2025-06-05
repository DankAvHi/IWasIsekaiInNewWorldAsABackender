import { octokit } from "../octokit";

export const getTrendingReposFromGithubApi = async () => {
  try {
    console.log("Getting trending repos...");
    const response = await octokit.rest.search.repos({
      q: "stars:>1",
      sort: "stars",
      order: "desc",
      per_page: 10,
    });
    const fetchedRepos = response.data.items;

    const convertedRepos: {
      raw: string;
      name: string;
      id: number;
      stars: number;
      url: string;
    }[] = [];

    fetchedRepos.forEach((repo: any) => {
      convertedRepos.push({
        raw: repo,
        name: repo.name,
        id: repo.id,
        stars: repo.stargazers_count,
        url: repo.html_url,
      });
    });
    console.log("Got trending repos");
    return convertedRepos;
  } catch (e) {
    console.error(`ERROR: Cannot get trending repos: ${e}`);
  }
};
