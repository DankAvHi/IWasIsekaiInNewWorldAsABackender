import { Typography } from "../../shared/ui";
import styles from "./Navigation.module.css";

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.Navigation}>
      <Typography
        className={styles.heading}
        TextComponent={"h1"}
      >{`Github Trends`}</Typography>
    </nav>
  );
};
