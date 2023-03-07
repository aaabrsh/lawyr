import Head from "next/head";
import globalMeta from "../../../globalmeta";
import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Header from "../../components/HeaderHome";

// The page for each post
export default function Post({ frontmatter, content }) {
  const { title, author, category, date, bannerImage, tags } = frontmatter;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={{ __html: md().render(content) }} />

        {/*
        	Open graph meta tags.
    	*/}
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={globalMeta.siteName} />
        <meta property="og:type" content={globalMeta.ogType} />
        <meta property="og:description" content={globalMeta.description} />
        <meta property="og:image" content={globalMeta.siteLogo} />
        <meta property="og:url" content={globalMeta.canonicalUrl} />
      </Head>
      <Header />

      <div className="mx-auto mt-12 w-1/2 overflow-hidden rounded-lg p-6 shadow dark:bg-gray-900 dark:text-gray-100">
        <article>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-4 dark:text-gray-400">
            {" "}
            <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <img
              src="/logosmall.png"
              alt=""
              className="h-10 w-10 rounded-full dark:bg-gray-500"
            />
            <div>
              <h3 className="text-sm font-medium">{author}</h3>
              <time
                datetime="2021-02-18"
                className="text-sm dark:text-gray-400"
              >
                {date}
              </time>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

// Generating the paths for each post
export async function getStaticPaths() {
  // Get list of all files from our posts directory
  const files = fs.readdirSync("posts");
  // Generate a path for each one
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));
  // return list of paths
  return {
    paths,
    fallback: false,
  };
}

// Generate the static props for the page
export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}
