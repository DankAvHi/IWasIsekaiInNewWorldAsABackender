import { execSync } from "child_process";
import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const externalDependencies = Object.keys(packageJson.dependencies || {});

const isProduction = process.env.NODE_ENV === "production";

async function cleanDist() {
  await fs.remove(path.resolve(__dirname, "dist"));
  console.log("Cleaned dist directory.");
}

async function buildServer() {
  console.log("Building server...");
  try {
    execSync("npx prisma generate", { cwd: __dirname, stdio: "inherit" });
    console.log("Prisma schema generated.");

    await esbuild.build({
      entryPoints: [path.resolve(__dirname, "src/index.ts")],
      outfile: path.resolve(__dirname, "dist/server.js"),
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
      sourcemap: !isProduction,
      minify: isProduction,
      external: externalDependencies,
    });

    const prismaSchemaPath = path.resolve(__dirname, "prisma/schema.prisma");
    if (fs.existsSync(prismaSchemaPath)) {
      await fs.ensureDir(path.resolve(__dirname, "dist/prisma"));
      await fs.copyFile(
        prismaSchemaPath,
        path.resolve(__dirname, "dist/prisma/schema.prisma")
      );
      console.log("Copied Prisma schema.");
    }

    console.log("Server build complete.");
  } catch (e) {
    console.error("Server build failed:", e);
    process.exit(1);
  }
}

async function buildClient() {
  console.log("Building client...");
  const clientDir = path.resolve(__dirname, "client");
  const clientBuildOutputDirName = "dist";
  const clientBuildDir = path.resolve(clientDir, clientBuildOutputDirName);
  const targetDir = path.resolve(__dirname, "dist/public");

  try {
    console.log(`Running 'npm run build' in ${clientDir}...`);
    execSync("npm run build", { cwd: clientDir, stdio: "inherit" });
    console.log("Client build completed via npm script.");

    await fs.ensureDir(targetDir);
    await fs.emptyDir(targetDir);

    if (fs.existsSync(clientBuildDir)) {
      await fs.copy(clientBuildDir, targetDir);
      console.log(
        `Copied client build from ${clientBuildDir} to ${targetDir}.`
      );
    } else {
      console.error(
        `Client build output directory not found: ${clientBuildDir}`
      );
      console.error(
        `Please ensure 'npm run build' in the client directory creates a '${clientBuildOutputDirName}' folder.`
      );
      process.exit(1);
    }
    console.log("Client build complete.");
  } catch (e) {
    console.error("Client build failed:", e);
    process.exit(1);
  }
}

async function main() {
  await cleanDist();
  await buildServer();
  await buildClient();
  console.log("Build finished successfully!");
}

main().catch((e) => {
  console.error("Build process encountered an error:", e);
  process.exit(1);
});
