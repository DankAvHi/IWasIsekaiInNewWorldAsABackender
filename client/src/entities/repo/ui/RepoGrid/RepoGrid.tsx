import { useEffect, useState } from "react";
import { Typography } from "../../../../shared/ui";
import { getTrendingRepos, syncTrendingRepos } from "../../api";
import { RepoCard } from "../RepoCard";
import { RepoSearch } from "../RepoSearch";
import styles from "./RepoGrid.module.css";

export const RepoGrid: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [repos, setRepos] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getTrendingRepos();
      setLoading(false);
      if (res) {
        setRepos(res);
      } else {
        setRepos([]);
      }
    };

    fetchData();
    setLoading(false);
  }, []);

  const onClick = async () => {
    setLoading(true);
    await syncTrendingRepos();
    const res = await getTrendingRepos();
    if (res) {
      setRepos(res);
    } else {
      setRepos([]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.RepoGrid}>
      <div className={styles.header}>
        <Typography
          TextComponent={"h2"}
        >{`Самые популярные репозитории на GitHub`}</Typography>

        <button
          onClick={onClick}
          disabled={loading}
          className={styles.refresh}
        >{`Обновить список`}</button>
      </div>
      <RepoSearch />
      <div className={styles.container}>
        {!repos ? (
          <Typography>{`Загрузка...`}</Typography>
        ) : repos.length === 0 ? (
          <Typography>{`Нет данных`}</Typography>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          repos.map((repo: any, index: number) => (
            <RepoCard key={repo.id} repo={repo} place={index + 1} />
          ))
        )}
      </div>
    </div>
  );
};
