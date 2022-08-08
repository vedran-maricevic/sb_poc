import { RoutePath } from "../service/routing-service";

export class Features {
  public static LIST = [
    { id: RoutePath.BarcodeOnJpeg, name: "Detect barcodes on .jpeg" },
    { id: RoutePath.BarcodeOnPng, name: "Detect barcodes on .png" },
    { id: RoutePath.BarcodeOnPdf, name: "Detect barcodes on .pdf" },
    { id: RoutePath.BarcodeOnAllImages, name: "Detect All (png, jpg, pdf or bmp)" },
  ];
}
