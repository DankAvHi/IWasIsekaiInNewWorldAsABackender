import { useCallback, useEffect, useRef, useState } from "react";
import { getRepoFromNameOrId } from "../../api";
import { RepoCard } from "../RepoCard";
import styles from "./RepoSearch.module.css";

export const RepoSearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = () => {
    if (inputRef.current) {
      setSearchValue(inputRef.current.value);
    }
  };

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRepoFromNameOrId(searchValue);
      if (!data) {
        setLoading(false);
        return setRepo(404);
      }
      setRepo(data);
      setSearchValue("");
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [searchValue]);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onClick();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onClick]);

  return (
    <div className={styles.RepoSearch}>
      <div className={styles.header}>
        <input
          className={styles.input}
          placeholder="Найти по имени"
          value={searchValue}
          onChange={onChange}
          ref={inputRef}
        />
        <button className={styles.button} onClick={onClick}>
          {`Поиск`}
        </button>
      </div>
      {!repo ? null : loading ? (
        <p>{`Загрузка...`}</p>
      ) : repo === 404 ? (
        <p>{`Репозиторий не найден`}</p>
      ) : (
        <RepoCard repo={repo} />
      )}
    </div>
  );
};
