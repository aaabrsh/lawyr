// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useState, Fragment, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Image } from "@react-pdf/renderer";

// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../../pdf-worker";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
// import Image from "next/image";
import useStore from "../../store/useStore";
import { useDrag } from "react-dnd";
import { useDrop, useDragDropManager } from "react-dnd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import { PDFDocument } from "pdf-lib";

// import axios from "axios";

// function PdfPage() {

// const [{ isOver }, drop] = useDrop({
//   accept: "signature",
//   drop: (item, monitor) => {
//     // Add the signature to the PDF document at the drop location
//   },
//   collect: (monitor) => ({
//     isOver: monitor.isOver(),
//     isDragging: monitor.isDragging(),
//   }),
// });

//   return (
//     <div ref={drop} style={{ backgroundColor: isOver ? "green" : "white" }}>
//       {/* Render PDF content here */}
//     </div>
//   );
// }

// function Signature() {
//   const [, drag] = useDrag({
//     type: spec.SIGNATURE,
//     // item: { type: spec.SIGNATURE },
//   });

//   return <div ref={drag}>Drag me!</div>;
// }

export function Sign({ plans }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageScale, setPageScale] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef(null);
  const user = session?.user?.email;
  const { blobFile } = useStore();

  const [openModel, setOpenModal] = useState(false);

  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [signature, setSignature] = useState(null);
  const dropRef = useRef(null);

  const sigCanvas = useRef();
  const [penColor, setPenColor] = useState("black");
  const [imageURL, setImageURL] = useState(null);

  const colors = ["black", "green", "red"];

  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setImageURL(URL);
    setOpenModal(false);
  };

  const download = () => {
    const dlink = document.createElement("a");
    dlink.setAttribute("href", imageURL);
    dlink.setAttribute("download", "signature.png");
    dlink.click();
  };

  useEffect(() => {
    if (blobFile) {
      const fileType = blobFile.type;
      const file = new File([blobFile], "pdf.pdf", { type: fileType });

      setFile(file);
      setOriginalFile(file);
    } else {
      async function loadPdf() {
        const response = await fetch("../../pdf.pdf");
        const pdfBlob = await response.blob();

        const fileType = pdfBlob.type;
        const file = new File([pdfBlob], "pdf.pdf", { type: fileType });

        setFile(file);
        setOriginalFile(file);
      }
      loadPdf();
    }
  }, []);

  function handleNext() {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  }
  function handlePrevious() {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handleZoomIn() {
    if (pageScale < 3) {
      setPageScale(pageScale + 0.2);
    }
  }

  function handleZoomOut() {
    if (pageScale > 0.3) {
      setPageScale(pageScale - 0.2);
    }
  }

  function onFileChange(event) {
    setFile(event.target.files[0]);
    setOriginalFile(event.target.files[0]);
  }

  function handleResetFile(event) {
    setFile(originalFile);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setTotalPages(numPages);
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  //   const dragDropManager = useDragDropManager();
  //   const monitor = dragDropManager.getMonitor();

  //   useEffect(
  //     () =>
  //       monitor.subscribeToOffsetChange(() => {
  //         const offset = monitor.getClientOffset();
  //         setSignaturePosition(offset);

  //         console.log(offset);
  //         // do stuff like setState, though consider directly updating style through refs for performance
  //       }),
  //     [monitor]
  //   );

  const Signature = () => {
    const [{ isDragging }, drag] = useDrag({
      type: spec.SIGNATURE,

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        position: monitor.getClientOffset(),
      }),
    });

    return (
      <div
        className={`h-32 w-32 rounded-lg border-2 border-gray-500 ${
          isDragging ? "opacity-50" : ""
        }`}
        ref={drag}
      >
        {imageURL && (
          <img
            className="h-8 w-8 rounded-full"
            src={imageURL}
            alt="signature"
            className="signature"
          />
        )}
      </div>
    );
  };

  const spec = {
    SIGNATURE: "signature",
  };

  const onDrop = (item, monitor) => {
    // setSignature(item.signature);
    setSignature(imageURL);

    const offset = monitor.getClientOffset();

    const pdfPage = document.querySelector(".react-pdf__Page__canvas");
    const pdfRect = pdfPage.getBoundingClientRect();

    const pdfScaleX = pdfPage.width / pdfRect.width;
    const pdfScaleY = pdfPage.height / pdfRect.height;

    let xPos = Math.round(offset.x - pdfRect.x) * pdfScaleX;
    let yPos = Math.round(pdfRect.height - (offset.y - pdfRect.y)) * pdfScaleY;

    const position = {
      x: xPos,
      y: yPos,
    };

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async () => {
      const pdfBytes = new Uint8Array(fileReader.result);

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pngImage = await pdfDoc.embedPng(imageURL);
      const pngDims = pngImage.scale(0.5);

      const page = pdfDoc.getPages()[pageNumber - 1];
      page?.drawImage(pngImage, {
        x: position.x,
        y: position.y,
        width: pngDims.width,
        height: pngDims.height,
      });

      const pdfBytesToDownload = await pdfDoc.save();
      const newFile = new File([pdfBytesToDownload], file.name, {
        type: "application/pdf",
      });

      setFile(newFile);
    };

    // setShowModal(false);
  };

  const handlePdfDownload = () => {
    const blob = new Blob([file], {
      type: "application/x-www-form-urlencoded",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;

    // trigger the download
    document.body.appendChild(link);
    link.click();

    // cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleSaveSignature = async () => {
    if (imageURL && session?.user?.id) {

      const blob = await fetch(imageURL).then((res) => res.blob());

      console.log(blob)
      
      const formData = new FormData();
      formData.append("image", blob);

      // Send the FormData to the Next.js API endpoint
      fetch(`/api/aws/upload/image/${session.user.id}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status < 400) {
            //TODO show Success Message
            console.log("Image uploaded successfully");
          } else {
            //TODO show error message
            console.log("error");
          }
        })
        .catch((error) => {
          console.error("Error uploading image", error);
        });
    } else {
      console.log("couldn't save signature");
    }
  };

  const [, drop] = useDrop({
    accept: "signature",
    drop: onDrop,
  });

  const onDragStart = (item) => {
    console.log(item);
  };

  return (
    <>
      {/* <DndProvider backend={HTML5Backend}> */}
      <Header />
      <div className="flex bg-[#fdfdff]">
        <div className=" flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div
          className={active ? "hidden flex-1 duration-1000 sm:block" : "flex-1"}
        >
          <div className="max-w-12xl lg:max-w-8xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
            {/* Chat start */}
            <>
              <div className="flex min-h-screen">
                <div className="w-64 flex-auto border-r-2 border-indigo-300 bg-indigo-50 p-4">
                  <div ref={dropRef}>
                    <div className="m-auto w-1/2">
                      <label htmlFor="file">Load a new pdf:</label>{" "}
                      <input
                        onChange={onFileChange}
                        type="file"
                        className="mb-8 rounded-full border-2 border-gray-900 px-6 py-2 uppercase transition duration-200 ease-in hover:bg-gray-800 hover:text-white focus:outline-none"
                      />
                    </div>
                    <div className="pdfdiv-assistant" ref={drop}>
                      <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        width={500}
                      >
                        {/* {Array.from({ length: numPages }, (_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      ))} */}
                        <Page
                          pageNumber={numPages}
                          scale={pageScale}
                          renderTextLayer={false}
                        ></Page>
                      </Document>
                    </div>
                  </div>
                  <div className="footer m-auto w-1/3">
                    <div className="button-container">
                      {/* <button onClick={handleZoomIn} disabled={pageScale >= 3}>
                        Zoom +
                      </button> */}
                      <button
                        onClick={handleZoomIn}
                        disabled={pageScale >= 3}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        <span>Zoom +</span>
                      </button>
                      <button
                        onClick={handleZoomOut}
                        disabled={pageScale <= 0.3}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        Zoom -
                      </button>
                    </div>
                    <div className="page-text">
                      Page {pageNumber} of {totalPages}
                    </div>
                    <div className="button-container">
                      <button
                        onClick={handlePrevious}
                        disabled={pageNumber === 1}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        ‹ Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={pageNumber === totalPages}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="flex-1 bg-indigo-50 p-4"> */}
                <div className="sticky top-0	ml-4 flex h-[42rem] w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg border-2 border-solid border-indigo-600 bg-white shadow-xl">
                  <div className="app">
                    <button onClick={() => setOpenModal(true)}>
                      Create Signature
                    </button>
                    <br />
                    {imageURL && (
                      <>
                        {/* <img
                          src={imageURL}
                          alt="signature"
                          className="signature"
                        />
                        <br />
                        <button
                          onClick={download}
                          style={{ padding: "5px", marginTop: "5px" }}
                        >
                          Download
                        </button> */}

                        <div className="mx-auto max-w-2xl">
                          <div className="max-w-md rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-8">
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                                Your Signature
                              </h3>
                              <a
                                href="#"
                                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                              >
                                View all
                              </a>
                            </div>
                            <div className="flow-root">
                              <ul
                                role="list"
                                className="divide-y divide-gray-200 dark:divide-gray-700"
                              >
                                <li className="py-3 sm:py-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-8 w-8 rounded-full"
                                        src={imageURL}
                                        alt="signature"
                                        className="signature"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        Neil Sims
                                      </p>
                                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                        email@windster.com
                                      </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                      <svg
                                        height="24px"
                                        viewBox="0 0 512 512"
                                        width="24px"
                                        xmlSpace="preserve"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M0 144H512V176H0z" />
                                        <path d="M0 240H512V272H0z" />
                                        <path d="M0 336H512V368H0z" />
                                      </svg>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <p className="mt-5">
                            Drag and drop you signiture to your document to sign
                            it.
                          </p>
                        </div>
                        <Signature />
                        <button onClick={handleResetFile}>Reset File</button>
                        <button onClick={handlePdfDownload}>
                          Download File
                        </button>
                        <button onClick={handleSaveSignature}>
                          Save Signature
                        </button>
                      </>
                    )}
                    {openModel && (
                      <div className="modalContainer">
                        <div className="modal">
                          <div className="sigPad__penColors">
                            <p>Pen Color:</p>
                            {colors.map((color) => (
                              <span
                                key={color}
                                style={{
                                  backgroundColor: color,
                                  border: `${
                                    color === penColor
                                      ? `2px solid ${color}`
                                      : ""
                                  }`,
                                }}
                                onClick={() => setPenColor(color)}
                              ></span>
                            ))}
                          </div>
                          <div className="sigPadContainer">
                            <SignatureCanvas
                              penColor={penColor}
                              canvasProps={{ className: "sigCanvas" }}
                              ref={sigCanvas}
                            />
                            <hr />
                            <button onClick={() => sigCanvas.current.clear()}>
                              Clear
                            </button>
                          </div>

                          <div className="modal__bottom">
                            <button onClick={() => setOpenModal(false)}>
                              Cancel
                            </button>
                            <button className="create" onClick={create}>
                              Create
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* </div> */}
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
      {/* </DndProvider> */}
    </>
  );
}

export default function MyPageWrapper() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Sign />
    </DndProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
