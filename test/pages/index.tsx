import Link from "next/link";
import styles from "styles/Home.module.css";

export default function Index() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>

      <footer className={styles.footer}>
        <Link href="">
          <a>Go to sass test page</a>
        </Link>
      </footer>
    </div>
  );
}
