import css from "styles/Index.module.css";
import sass from "styles/Index.module.scss";

export default function Index() {
  return (
    <div className={css.container}>
      <main className={css.main}>
        <h1 className={sass.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
}
