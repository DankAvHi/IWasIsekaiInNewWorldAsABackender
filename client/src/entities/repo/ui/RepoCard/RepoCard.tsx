import { Typography } from "../../../../shared/ui";
import styles from "./RepoCard.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RepoCard: React.FC<{ repo: any; place: number }> = ({
  repo,
  place,
}) => {
  return (
    <div className={styles.RepoCard}>
      <Typography>{`Место: ${place}`}</Typography>
      <div className={styles.header}>
        <Typography>{`${repo.name}`}</Typography>
        <Typography>{`ID:${repo.id}`}</Typography>
      </div>

      <Typography>{`Звёзд: ${repo.stars}`}</Typography>
      <Typography>{`Краткое описание: ${repo.raw.description}`}</Typography>
      <a>{`Ссылка на репозиторий: ${repo.url}`}</a>
    </div>
  );
};
