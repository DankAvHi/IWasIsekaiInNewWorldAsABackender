import { Octokit } from "octokit";
import { environmentVariables } from "../config";

export const octokit = new Octokit({
  auth: environmentVariables.GITHUB_ACCESS_TOKEN,
});
