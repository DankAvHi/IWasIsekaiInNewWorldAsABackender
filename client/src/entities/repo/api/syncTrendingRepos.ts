export const syncTrendingRepos = async () => {
  try {
    const response = await fetch("http://localhost:8080/sync", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
