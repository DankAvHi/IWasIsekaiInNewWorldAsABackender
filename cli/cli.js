#!/usr/bin/env node

const BASE_URL = "http://localhost:8080";

async function fetchTrendingRepos() {
  try {
    const response = await fetch(`${BASE_URL}/api/repo`);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${await response.text()}`
      );
    }
    const data = await response.json();

    if (data && data.length > 0) {
      console.log("Trending Repositories:");
      data.forEach((repo) => {
        console.log(
          `- ${repo.name} (${repo.language || "N/A"}): ${repo.stars} stars`
        );
        console.log(`  ${repo.raw.description || "No description"}`);
        console.log(`  URL: ${repo.url}`);
        console.log("---");
      });
    } else {
      console.log("No trending repositories found or empty response.");
    }
  } catch (error) {
    console.error("Error fetching trending repositories:", error.message);
  }
}

async function fetchRepoDetails(repoNameOrId) {
  if (!repoNameOrId) {
    console.error("Error: repository name are required.");
    printHelp();
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/api/repo/${repoNameOrId}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Repository ${repoNameOrId} not found.`);
        return;
      }
      throw new Error(
        `HTTP error! status: ${response.status} - ${await response.text()}`
      );
    }
    const repo = await response.json();

    if (repo) {
      console.log("Repository Details:");
      console.log(`Name: ${repo.name}`);
      console.log(`Owner: ${repo.raw.owner?.login}`);
      console.log(`Language: ${repo.raw.language || "N/A"}`);
      console.log(`Stars: ${repo.stars}`);
      console.log(`Description: ${repo.raw.description || "No description"}`);
      console.log(`URL: ${repo.url}`);
      console.log(
        `Created At: ${new Date(repo.raw.created_at).toLocaleDateString()}`
      );
      console.log(
        `Last Push: ${new Date(repo.raw.pushed_at).toLocaleDateString()}`
      );
    } else {
      console.log(`Repository ${repoNameOrId} not found or empty response.`);
    }
  } catch (error) {
    console.error(`Error fetching repository ${repoNameOrId}:`, error.message);
  }
}

async function triggerSync() {
  console.log(
    "Attempting to trigger database synchronization via /sync endpoint..."
  );
  try {
    const response = await fetch(`${BASE_URL}/api/sync`, { method: "GET" });
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${await response.text()}`
      );
    }
    const result = await response.json();
    console.log(
      "Sync triggered successfully:",
      result.message || "Sync process initiated."
    );
  } catch (error) {
    console.error("Error triggering sync:", error.message);
  }
}

function printHelp() {
  console.log(`
Usage: repo-cli <command> [options]

Commands:
  ls                         Fetch and list trending repositories
  get-repo <name/ID>         Fetch details for a specific repository
  sync                       Trigger database synchronization 
  help                       Show this help message
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (
    !command ||
    command === "help" ||
    command === "-h" ||
    command === "--help"
  ) {
    printHelp();
    process.exit(0);
  }

  switch (command) {
    case "sync":
      await triggerSync();
      break;
    case "ls":
      await fetchTrendingRepos();
      break;
    case "get-repo":
      const repoNameOrId = args[1];
      await fetchRepoDetails(repoNameOrId);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
