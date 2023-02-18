import { PDFDocument } from "pdf-lib";

async function modifyPdf(pdfDoc: PDFDocument, data: any): Promise<Uint8Array> {
     const form = pdfDoc.getForm();
 
     //get the form input field names from the pdf
     let formKeys: string[] = []
     const fields = form.getFields();
     fields.forEach(field => {
         const name = field.getName()
         formKeys.push(name);
     })
     
     //write data to the form fields
     formKeys.forEach((key) => {
         if (!key.toLowerCase().includes("signature")) {
             const field = form.getTextField(key);
             field.setText(data[key]);
             field.setFontSize(12);
         }
     });
 
     // Flatten the form's fields
     form.flatten();
 
     // Serialize the PDFDocument to bytes (a Uint8Array)
     const pdfBytes = await pdfDoc.save()
 
     return pdfBytes;
}

export default modifyPdf;