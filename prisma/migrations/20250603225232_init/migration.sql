-- CreateTable
CREATE TABLE "Repo" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "raw" JSONB NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repo_name_key" ON "Repo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Repo_url_key" ON "Repo"("url");
