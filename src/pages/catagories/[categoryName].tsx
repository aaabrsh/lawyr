import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Dashboard/Sidebar";
import formStyles from "../../styles/form.module.css";
import { PDFDocument } from "pdf-lib";
import { promises as fs } from "fs";
import path from "path";
import { Dialog, Transition } from "@headlessui/react";

export default function ({ questions }) {
  const questionsCount = questions.length;
  let [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [formAnswers, setFormAnswers] = useState({});
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { categoryName } = router.query;

  const handleBackClick = (event: any) => {
    event.preventDefault();
    setCurrentPage((current) => current - 1);
  };

  const handleNextClick = (event: any) => {
    event.preventDefault();

    //get input elements from the form
    const formElements = event.target.elements;
    const formData = {};
    const currentQuestions = questions[currentPage];

    //extract the name and values of the input elemts and store them on formData
    currentQuestions.forEach((question: any) => {
      const formElementName = question.name;
      formData[formElementName] = formElements[formElementName].value;
    });

    setFormAnswers((answers) => ({ ...answers, ...formData }));

    if (currentPage === questionsCount - 1) {
      //if we're on the last question
      setIsOpen(true);
    } else {
      setCurrentPage((current) => current + 1);
    }
  };

  const handleChange = (event: any) => {
    setFormAnswers((answers) => ({
      ...answers,
      [event.target.name]: event.target.value,
    }));
  };

  const displayFormInput = (question: any, index: number) => {
    switch (question.tag) {
      case "input":
        return (
          <div key={index} className="mb-4">
            <label className={formStyles.label}>{question.label}</label>
            <input
              className={formStyles.input}
              type={question.type}
              name={question.name}
              value={
                formAnswers[question.name] ? formAnswers[question.name] : ""
              }
              onChange={handleChange}
              required={question.required}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={index} className="mb-4">
            <label className={formStyles.label}>{question.label}</label>
            <textarea
              className={formStyles.input}
              name={question.name}
              value={
                formAnswers[question.name] ? formAnswers[question.name] : ""
              }
              onChange={handleChange}
              required={question.required}
            />
          </div>
        );
    }
  };

  const handleDownload = async () => {
    // Fetch an existing PDF document
    const url = "https://eforms.com/download/2018/04/Offical-Demand-Letter.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Trigger the browser to download the PDF document
    download(pdfDoc, "pdf-lib_modification_example.pdf", "application/pdf");

    //Close Modal
    setIsOpen(true);
  };

  return (
    <>
      <Header />
      <div className="flex bg-[#fdfdff]">
        <div className="flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div
          className={active ? "hidden flex-1 duration-1000 sm:block" : "flex-1"}
        >
          <div className="py-6 px-10">
            {questions.length === 0 ? (
              <div>No Questions Found</div>
            ) : (
              // Multi-step form
              <div>
                <h1 className="my-2">
                  Step {currentPage + 1} of {questionsCount}
                </h1>
                <form onSubmit={handleNextClick} className={formStyles.form}>
                  {questions[currentPage].map((question: any, index: number) =>
                    displayFormInput(question, index)
                  )}
                  <div className="flex justify-between">
                    <div>
                      {currentPage !== 0 && (
                        <button
                          onClick={handleBackClick}
                          className={formStyles.button}
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <div>
                      <button type="submit" className={formStyles.button}>
                        {currentPage === questionsCount - 1 ? "Finish" : "Next"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download PDF Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Download PDF
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your PDF file is Ready. Click the download button to
                      download
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-red-900 bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-blue-900 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleDownload}
                    >
                      Download PDF
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const categoryName = context.params.categoryName;
  const dataDirectory = path.join(process.cwd(), "src/data");
  let data = await fs.readFile(dataDirectory + "/questions.json", "utf8");
  data = JSON.parse(data)[categoryName];

  let questions: any = [];

  if (data) {
    //if a data with the given category name is found
    questions = data.questions;
  }

  return {
    props: {
      questions,
    },
  };
}
