// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Image from "next/image";
import Catagories from "../components/Dashboard/Catagories";
import { checkout } from "../lib/getStripe";
import initStripe from "stripe";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useRef } from "react";
import { pdfjs } from "react-pdf";

import workerSrc from "../../pdf-worker";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// import axios from "axios";

export default function Plans({ plans }) {
  const [legalese, setLegalese] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState();
  const [active, setActive] = useState(false);
  const { data: session } = useSession();
  const ref = useRef(null);
  const user = session?.user?.email;
  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();

    reader.onload = async () => {
      const fileData = new Uint8Array(reader.result);

      // Load the PDF file and get the first page
      const loadingTask = pdfjs.getDocument({
        data: fileData,
      });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      // Extract text content from the page
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(" ");
      setLegalese(text);
      queryPrompt(legalese);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const queryPrompt = (prompt) => {
    const DEFAULT_PARAMS = {
      model: "text-davinci-003",
      temperature: 0.3,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    fetch("/prompts/legalese.prompt")
      .then((response) => response.text())
      .then((text) => text.replace("$legalese", prompt))
      // .then((text) => text.replace("$legalese", JSON.stringify(legalese)))
      .then((prompt) => {
        console.log(prompt);

        const params = { ...DEFAULT_PARAMS, prompt: prompt };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(OPENAI_API_KEY),
          },
          body: JSON.stringify(params),
        };
        fetch("https://api.openai.com/v1/completions", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const text = data.choices[0].text;
            console.log(text);
            const new_graph = JSON.parse(text);
            console.log(new_graph);
            setState(new_graph, () => {
              console.log(state);
            });
            document.body.style.cursor = "default";
            document.getElementsByClassName("generateButton")[0].disabled =
              false;
            document.getElementsByClassName("searchBar")[0].value = "";
          })
          .catch((error) => {
            console.log(error);
            document.body.style.cursor = "default";
            document.getElementsByClassName("generateButton")[0].disabled =
              false;
          });
      });
  };
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
  }, []);

  const handleClick = (event) => {
    setLegalese(ref.current.value);
    queryPrompt(legalese);
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
            {/* Chat start */}
            <>
              <div className="flex min-h-screen w-full items-center justify-center bg-white">
                <div>
                  <div className="flex justify-between">
                    <div className="mb-4">
                      <span className="cursor-pointer rounded-md bg-[#F3F4F6] p-2 font-semibold">
                        Write
                      </span>
                      <span className="mt-2 flex items-end gap-3">
                        <label
                          className="mb-2 block font-bold text-gray-700"
                          htmlFor="file"
                        >
                          Choose a file
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="file"
                            name="file"
                            accept="application/pdf"
                            onChange={handleFileUpload}
                            className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <div className="inline-flex justify-center rounded-md border border-transparent bg-[#4F46E5] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                            <span className="w-[200px] truncate text-white">
                              {file ? file.name : "No file chosen"}
                            </span>
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className="flex gap-3 text-[#9CA3AF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                  </div>
                  <textarea
                    placeholder="Add your comment..."
                    className="h-[220px] w-[60vw] resize-none rounded-md border-[0.1px] border-[#9EA5B1] p-2 font-bold focus:outline-1 focus:outline-blue-500"
                    defaultValue={""}
                    ref={ref}
                    id="message"
                    name="message"
                  />
                  <div className="flex justify-end">
                    <button
                      className="absolute w-fit rounded bg-[#4F46E5] py-2 px-3 text-sm font-semibold text-white"
                      onClick={handleClick}
                    >
                      Translate
                    </button>
                  </div>

                  <div className="result">
                    <h2 className="py-10	text-4xl	">Translated Document:</h2>
                    <textarea
                      placeholder="Add your comment..."
                      className="h-[220px] w-[60vw] resize-none rounded-md border-[0.1px] border-[#9EA5B1] p-2 font-bold focus:outline-1 focus:outline-blue-500"
                      defaultValue={legalese}
                    />
                  </div>
                </div>
              </div>
            </>
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
// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// }
