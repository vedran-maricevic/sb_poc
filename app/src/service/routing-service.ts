import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export enum RoutePath {
  DocumentScanner = "document-scanner",
  BarcodeOnPng = "document-on-png",
  BarcodeOnJpeg = "barcode-on-jpeg",
  BarcodeOnPdf = "barcode-on-pdf",
  ImageResults = "image-results",
  ImageDetails = "image-details",
  LicenseInfo = "license-info",
  CroppingView = "cropping-view",
  BarcodeScanner = "barcode-scanner",
  BarcodeOnAllImages = "image-scanner"
}

export class RoutingService {
  public static instance = new RoutingService();

  public route(path: RoutePath, args?: any) {
    let query = "";
    if (args) {
      query += "?";
      const keys = Object.keys(args);
      keys.forEach((key: string) => {
        query += key + "=" + args[key];
      });
    }

    history.push("#/" + path + query);
  }

  public reset() {
    history.replace("#/");
  }

  public observeChanges(action: any) {
    history.listen((update) => {
      action();
    });
  }

  public back() {
    history.back();
  }
}
