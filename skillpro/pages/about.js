import Head from "next/head";
import Link from "next/link";
import "@/styles/globals.css";

export default function About() {
  return (
    <>
      <Head>
        <title>About – SkillPro</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <section>
          <p>
            SkillPro is an intuitive learning platform designed to help users
            stay focused on their enrolled courses.
          </p>
          <p>
            We aim to make learning structured, accessible, and tailored to each
            user’s needs.
          </p>
        </section>
      </main>

      <footer>
        <p>© 2025 SkillPro. Empowering learners every step of the way.</p>
      </footer>
    </>
  );
}
