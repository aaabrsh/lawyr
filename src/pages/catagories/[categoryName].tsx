import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Dashboard/Sidebar";
import formStyles from "../../styles/form.module.css";
import { PDFDocument } from "pdf-lib";
import { promises as fs } from "fs";
import path from "path";
import { Dialog, Transition } from "@headlessui/react";
import modifyPdf from "../../utils/modifyPdf";

export default function ({ questions, pdf_url }) {
  const questionsCount = questions.length;
  let [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [formAnswers, setFormAnswers] = useState({});
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { categoryName } = router.query;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/downloadjs@1.4.7";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBackClick = (event: any) => {
    event.preventDefault();
    setCurrentPage((current) => current - 1);
  };

  const handleNextClick = (event: any) => {
    event.preventDefault();
    if (currentPage === questionsCount - 1) {
      //if we're on the last question
      setIsOpen(true);
    } else {
      setCurrentPage((current) => current + 1);
    }
  };

  const handleChange = (event: any) => {
    let newValue = event.target.value;

    if (event.target.type === "checkbox") {
      let oldValues =
        formAnswers[event.target.name] &&
          formAnswers[event.target.name].length > 0
          ? formAnswers[event.target.name]
          : [];
      if (oldValues.find((value: any) => value === newValue)) {
        oldValues = oldValues.filter((value: any) => value !== newValue);
      } else {
        oldValues.push(newValue);
      }
      newValue = oldValues;
    }

    setFormAnswers((answers) => ({
      ...answers,
      [event.target.name]: newValue,
    }));
  };

  const displayFormInput = (question: any, index: number) => {
    switch (question.tag) {
      case "input":
        //handle different <input /> types (checkbox, radio, text, number, date...)
        switch (question.type) {
          case "checkbox":
          case "radio":
            return (
              <div key={index} className="mb-4">
                <label className={formStyles.label}>{question.label}</label>
                <div className="flex flex-wrap">
                  {question.options.map((option: any, index_1: number) => (
                    <div key={index_1} className="flex flex-grow">
                      <label
                        className="pr-2"
                        htmlFor={question.name + "_" + index_1}
                      >
                        {option.label}
                      </label>
                      <input
                        id={question.name + "_" + index_1}
                        type={question.type}
                        name={question.name}
                        value={option.value}
                        checked={
                          question.type === "radio" //if input type is radio
                            ? formAnswers[question.name]
                              ? formAnswers[question.name] === option.value
                              : false
                            : formAnswers[question.name] //if input type is checkbox
                              ? formAnswers[question.name].find(
                                (value: any) => value === option.value
                              )
                                ? true
                                : false
                              : false
                        }
                        required={question.type === "radio" ? question.required : false}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          default:
            return (
              <div key={index} className="mb-4">
                <label htmlFor={question.name} className={formStyles.label}>
                  {question.label}
                </label>
                <input
                  id={question.name}
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
        }

      case "textarea":
        return (
          <div key={index} className="mb-4">
            <label htmlFor={question.name} className={formStyles.label}>
              {question.label}
            </label>
            <textarea
              id={question.name}
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
      case "select":
        return (
          <div key={index} className="mb-4">
            <label htmlFor={question.name} className={formStyles.label}>
              {question.label}
            </label>
            <select
              id={question.name}
              className={formStyles.input}
              name={question.name}
              required={question.required}
              onChange={handleChange}
              value={
                formAnswers[question.name] ? formAnswers[question.name] : ""
              }
            >
              {question.options.map((option: any, index_1: number) => (
                <option key={index_1} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
    }
  };

  const handleDownload = async () => {
    // Fetch an existing PDF document
    const existingPdfBytes = await fetch(pdf_url).then((res) =>
      res.arrayBuffer()
    );

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pdfBytes: Uint8Array = await modifyPdf(pdfDoc, formAnswers);

    // create the blob object with content-type "application/pdf"               
    var blob = new Blob([pdfBytes], { type: "application/pdf" });

    const formData = new FormData();
    formData.append("pdfFile", blob);

    fetch(`/api/upload/${categoryName}`, {
      method: 'POST',
      body: formData
    })

    // Trigger the browser to download the PDF document
    download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");

    //Close Modal
    setIsOpen(false);
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
  let data: any = await fs.readFile(dataDirectory + "/questions.json", "utf8");
  data = JSON.parse(data)[categoryName];

  let questions: any = [];
  let pdf_url: String = "";

  if (data) {
    //if a data with the given category name is found
    questions = data.questions;
    pdf_url = data.pdf_url;
  }

  return {
    props: {
      questions,
      pdf_url,
    },
  };
}
