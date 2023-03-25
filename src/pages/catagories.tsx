/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import ReactPaginate from "react-paginate";
import { prisma } from "../server/db";

// import axios from "axios";
export default function Welcome({ products }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [pageCount, setPageCount] = useState(products.length / itemsPerPage);
  const [itemOffset, setItemOffset] = useState(0);
  const { data: session } = useSession();
  const user = session?.user?.email;
  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  //   const getFiles = async () => {
  //     const { data } = await axios.get(`/api/file?email=${user}`);
  //     const key = "title";
  //     const array = data.datas
  //     const arrayUniqueByKey = [
  //       ...new Map(array.map((item) => [item[key], item])).values(),
  //     ];

  //     setFiles(arrayUniqueByKey);
  //   };
  useEffect(() => {
    // getFiles();

    const endOffset = itemOffset + itemsPerPage;
    setDisplayedProducts(products.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [products, itemOffset]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Header />
      <div className="flex bg-[#fdfdff]">
        <div className=" flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div
          className={active ? "hidden flex-1 duration-1000 sm:block" : "flex-1"}
        >
          <div className="mx-auto max-w-2xl py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="overflow-hidden py-16 dark:bg-gray-900">
              <div className="container m-auto space-y-8 px-6 text-gray-300 md:px-12">
                <div>
                  <span className="text-lg font-semibold text-gray-200">
                    Use cases
                  </span>
                  {/* <h2 className="mt-4 text-2xl font-bold text-gray-100 md:text-4xl">
              {" "}
              <br className="lg:block" hidden="" />
            </h2> */}
                </div>

                <div className="flex flex-wrap gap-3">
                  {displayedProducts.map((product: any) => (
                    <div className="usecasecards group relative w-[270px] flex-grow bg-gray-100 transition hover:z-[1] hover:shadow-2xl xl:block">
                      <div className="relative flex h-full flex-col space-y-8 rounded-lg border-dashed p-8 transition duration-300 group-hover:scale-90 group-hover:border group-hover:bg-white">
                        <img
                          src={product.iconImage}
                          className="w-10"
                          width={512}
                          height={512}
                          alt="burger illustration"
                        />
                        <div className="flex max-h-[140px] flex-grow flex-col space-y-2 overflow-hidden">
                          <h5 className="text-xl font-medium text-gray-200 transition group-hover:text-yellow-600 ">
                            {product.title}
                          </h5>
                          <p className="flex-grow text-sm text-gray-200 group-hover:text-gray-600">
                            {product.description}
                          </p>
                        </div>

                        <Link
                          href="/catagories/[categoryName]"
                          as={`/catagories/${product.title}`}
                        >
                          <div className="flex items-center justify-between group-hover:text-yellow-600">
                            <span className="text-sm">Read more</span>
                            <span className="-translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                              →
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <ReactPaginate
                  nextLabel={<>&#8594;</>}
                  previousLabel={<>&#8592;</>}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={2}
                  pageCount={pageCount}
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="break-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-blue-900 bg-opacity-25" />
          </Transition.Child>

          {/* <Options setIsOpen={setIsOpen} /> */}
        </Dialog>
      </Transition>
    </>
  );
}

export async function getServerSideProps(context: any) {
  //redirect to home page if user is not logged in
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const customer = await prisma.customer.findFirst({
    where: {
      userId: session.user?.id,
    },
  });

  if (!customer || !customer.billingPlan) {
    return {
      redirect: {
        destination: "/setting",
        permanent: false,
      },
    };
  }

  const dataDirectory = path.join(process.cwd(), "src/data");
  let products = await fs.readFile(dataDirectory + "/products.json", "utf8");
  products = JSON.parse(products).data.getProductCards;

  return {
    props: {
      products,
    },
  };
}
