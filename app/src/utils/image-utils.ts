// @ts-ignore
import { pdfjs } from "react-pdf";

const pdfVersion = "2.6.347";
const pdfWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export class ImageUtils {
  public static readonly MIME_TYPE_JPEG = "image/jpg";
  public static readonly MIME_TYPE_PNG = "image/png";
  public static readonly MIME_TYPE_PDF = "application/pdf";
  public static readonly MIME_GENERIC_IMAGES = "image/jpeg,image/png,image/bmp,image/tiff,application/pdf,.pdf"

  public static pick(mime: string, parentElement: HTMLElement, asDataUrl?: boolean): Promise<any> {
    return new Promise<any>((resolve) => {
      let picker = document.getElementById("picker" + parentElement.id) as HTMLInputElement;

      if (!picker) {
        picker = document.createElement("input") as HTMLInputElement;
        parentElement.appendChild(picker);
        picker.id = "picker" + parentElement?.id;
        picker.type = "file";
        picker.accept = mime;
       
        picker.style.marginLeft = '5px';
        parentElement.style.whiteSpace = "nowrap"
        parentElement.style.textOverflow = "ellipsis"
        parentElement.style.flexDirection = "row";
        parentElement.style.display = 'flex';
        parentElement.style.alignItems = 'center';
      }

      picker.onchange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        // @ts-ignore
        let file = e.target.files[0];

        if (asDataUrl) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsArrayBuffer(file);
        }

        reader.onload = async (e) => {

          const result = reader.result;
          if (asDataUrl) {
            resolve({ data: result, fileType: file.type });
          } else {
            // @ts-ignore
            resolve({ original: new Uint8Array(result) });
          }
          picker.remove();
        };
      };
    });
  }

  public static async pdfToImage(data: any) {
    const images: any[] = [];
    const pdf = await pdfjs.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas.toDataURL());
    }
    canvas.remove();
    return images;
  }
}
