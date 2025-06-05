import cors from "cors";
import Express from "express";
import { preloadEnvironmentVariables } from "./config";
import { getTrendingRepos } from "./github";
import { getRepo } from "./github/getRepo";
import { syncTrendingReposWithDatabase } from "./github/syncTrendingReposWithDatabase";

const isEnvironmentVariablesExisted = preloadEnvironmentVariables();

if (!isEnvironmentVariablesExisted)
  throw new Error("Environment variables are missing");

const app = Express();
app.use(cors());
app.get("/", async (_req, res) => {
  try {
    res.json(await getTrendingRepos());
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});
app.get("/repo/:name", async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(404).json({ message: "Name or id is missing" });
    }
    res.json(await getRepo(name));
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});
app.get("/sync", async (_req, res) => {
  try {
    console.log("Syncing...");
    res.json({ success: await syncTrendingReposWithDatabase() });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.listen(8080, () => {
  console.log(`App started on http://localhost:8080`);
});
