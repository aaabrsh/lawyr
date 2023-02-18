/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import formStyles from "../styles/form.module.css";

// import axios from "axios";

export default function Welcome() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/downloadjs@1.4.7";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function hanldeFormSubmit(event: Event) {
    event.preventDefault();
    const formElements = event.target.elements;
    const formData: any = {};

    // for (const element of formElements) {
    //   formData[element.name] = element.value;
    // }

    for (let i = 0; i < formElements.length - 1; i++) {
      const element = formElements[i];
      formData[element.name] = element.value;
    }
    console.log(formData);
    modifyPdf(formData);
  }

  async function modifyPdf(formData: any) {
    // Fetch an existing PDF document
    const url = "https://eforms.com/download/2018/04/Offical-Demand-Letter.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const form = pdfDoc.getForm();

    //form input field keys on pdf file
    const formKeys = [
      "From 1",
      "From 2",
      "From 3",
      "From 4",
      "Date",
      "20",
      "Dear",
      "I",
      "undefined",
      "If there is no response to this demand letter by",
      "20_2",
    ];

    formKeys.forEach((key) => {
      const field = form.getTextField(key);
      field.setText(formData[key]);
      field.setFontSize(12);
    });

    // // Embed the Helvetica font
    // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // // Get the first page of the document
    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];

    // // Get the width and height of the first page
    // const { width, height } = firstPage.getSize();

    // // Draw a string of text diagonally across the first page
    // firstPage.drawText("This text was added with JavaScript!", {
    //   x: 5,
    //   y: height / 2 + 300,
    //   size: 50,
    //   font: helveticaFont,
    //   color: rgb(0.95, 0.1, 0.1),
    //   rotate: degrees(-45),
    // });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
  }

  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
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
  }, []);

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
            {/* form */}
            <body className="mx-10 my-4">
              <h1 className="text-3xl font-extrabold text-gray-800">
                Official Demand Letter
              </h1>
              <p className="mb-4 text-gray-500">
                please answer the following questions to create an official
                demand letter.
              </p>
              <form className={formStyles.form} onSubmit={hanldeFormSubmit}>
                <div className={formStyles.inputs_container}>
                  <div className="w-full">
                    <label className={formStyles.label} htmlFor="name">
                      Full Name
                    </label>
                    <input
                      className={formStyles.input}
                      type="text"
                      id="name"
                      name="I"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className={formStyles.label} htmlFor="recepient">
                      Recipient
                    </label>
                    <input
                      className={formStyles.input}
                      type="text"
                      id="recepient"
                      name="Dear"
                      required
                    />
                  </div>
                </div>

                <div className={formStyles.inputs_container}>
                  <div className="w-full">
                    <label htmlFor="date" className={formStyles.label}>
                      Date of Letter
                    </label>
                    <div className="flex">
                      <input
                        className={formStyles.input}
                        type="text"
                        id="date"
                        name="Date"
                        required
                      />
                      <span>&nbsp;/&nbsp;</span>
                      <div>
                        <label
                          htmlFor="year"
                          className={formStyles.label_inline}
                        >
                          20
                        </label>
                        <input
                          className={`${formStyles.input} ${formStyles.year_input}`}
                          type="number"
                          id="year"
                          name="20"
                          min={0}
                          max={99}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label className={formStyles.label} htmlFor="last_date">
                      Last Date for Response
                    </label>
                    <div className="flex">
                      <input
                        className={formStyles.input}
                        type="text"
                        id="last_date"
                        name="If there is no response to this demand letter by"
                        required
                      />
                      <span>&nbsp;/&nbsp;</span>
                      <div>
                        <label
                          className={formStyles.label_inline}
                          htmlFor="last_date_year"
                        >
                          20
                        </label>
                        <input
                          className={`${formStyles.input} ${formStyles.year_input}`}
                          type="number"
                          id="last_date_year"
                          name="20_2"
                          required
                          min={0}
                          max={99}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={formStyles.label} htmlFor="reason">
                    Reason for Letter
                  </label>
                  <input
                    type="text"
                    className={formStyles.input}
                    id="reason"
                    name="undefined"
                    required
                  />
                </div>

                <fieldset className="mb-6 rounded border py-3 px-5">
                  <legend>&nbsp; Address Information &nbsp;</legend>
                  <div className={formStyles.inputs_container}>
                    <div className="w-full">
                      <label className={formStyles.label} htmlFor="address1">
                        Street Address
                      </label>
                      <input
                        className={formStyles.input}
                        type="text"
                        id="address1"
                        name="From 1"
                      />
                    </div>
                    <div className="w-full">
                      <label className={formStyles.label} htmlFor="address2">
                        Street Address (line 2)
                      </label>
                      <input
                        className={formStyles.input}
                        type="text"
                        id="address2"
                        name="From 2"
                      />
                    </div>
                  </div>
                  <div className={formStyles.inputs_container}>
                    <div className="w-full">
                      <label className={formStyles.label} htmlFor="city">
                        City, State
                      </label>
                      <input
                        className={formStyles.input}
                        type="text"
                        id="city"
                        name="From 3"
                      />
                    </div>
                    <div className="w-full">
                      <label className={formStyles.label} htmlFor="zip_code">
                        Zip Code
                      </label>
                      <input
                        className={formStyles.input}
                        type="text"
                        id="zip_code"
                        name="From 4"
                      />
                    </div>
                  </div>
                </fieldset>
                <div className="flex justify-end">
                  <button className={formStyles.button} type="submit">
                    Download PDF
                  </button>
                </div>
              </form>

              <p>
                Click the button to modify an existing PDF document with{" "}
                <code>pdf-lib</code>
              </p>
              <button onClick={modifyPdf}>Modify PDF</button>
              <p className="small">
                (Your browser will download the resulting file)
              </p>
            </body>
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
