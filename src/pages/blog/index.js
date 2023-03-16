import fs from "fs";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/HeaderHome";

// The Blog Page Content
export default function Blog({ posts }) {
  return (
    <>
      <Header />
      <main>
        {posts.map((post) => {
          //extract slug and frontmatter
          const { slug, frontmatter } = post;
          //extract frontmatter properties
          const { title, author, category, date, bannerImage, tags } =
            frontmatter;

          //JSX for individual blog listing
          return (
            // <article key={title}>
            //   <Link href={`/blog/${slug}`}>
            //     <h1>{title}</h1>
            //   </Link>
            //   <h3>{author}</h3>
            //   <h3>{date}</h3>
            // </article>
            <div className="dark:bg-gray-800 dark:text-gray-100">
              <div className="container mx-auto mt-12 max-w-4xl rounded-lg px-10 py-6 shadow-sm dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-400">{date}</span>
                </div>
                <div className="mt-3">
                  <Link href={`/blog/${slug}`}>{title}</Link>
                  {/* <p className="mt-2">
                    Tamquam ita veritas res equidem. Ea in ad expertus paulatim
                    poterunt. Imo volo aspi novi tur. Ferre hic neque vulgo hae
                    athei spero. Tantumdem naturales excaecant notaverim etc cau
                    perfacile occurrere. Loco visa to du huic at in dixi aër.
                  </p> */}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/blog/${slug}`}
                    className="hover:underline dark:text-violet-400"
                  >
                    Read
                  </Link>
                  <div>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="flex items-center"
                    >
                      <img
                        src="/logosmall.png"
                        alt="avatar"
                        className="mx-4 h-10 w-10 rounded-full object-cover dark:bg-gray-500"
                      />
                      <span className="hover:underline dark:text-gray-400">
                        {author}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}

//Generating the Static Props for the Blog Page
export async function getStaticProps() {
  // get list of files from the posts folder
  const files = fs.readdirSync("posts");

  // get frontmatter & slug from each post
  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  // Return the pages static props
  return {
    props: {
      posts,
    },
  };
}
