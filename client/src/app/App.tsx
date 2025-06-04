import { RepoGrid } from "../entities/repo";
import { Navigation } from "../widgets/Navigation";
import styles from "./App.module.css";

export const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <Navigation />
      <main className={styles.main}>
        <RepoGrid />
      </main>
    </div>
  );
};
