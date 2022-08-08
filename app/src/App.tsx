import React from "react";
import { AppBar } from "@material-ui/core";

import { Barcode, } from "scanbot-web-sdk/@types";

import { NavigationContent } from "./subviews/navigation-content";
import { Toast } from "./subviews/toast";
import FeatureList from "./subviews/feature-list";
import { BottomBar } from "./subviews/bottom-bar";

import ImageResultsPage from "./pages/image-results-page";
import ImageDetailPage from "./pages/image-detail-page";
import CroppingPage from "./pages/cropping-page";

import Pages from "./model/pages";
import { ScanbotSdkService } from "./service/scanbot-sdk-service";
import { RoutePath, RoutingService } from "./service/routing-service";

import { ImageUtils } from "./utils/image-utils";
import { NavigationUtils } from "./utils/navigation-utils";
import DocumentScannerComponent from "./rtu-ui/document-scanner-component";
import ErrorLabel from "./subviews/error-label";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      alert: undefined,
      activeImage: undefined,
      sdk: undefined,
      error: {
        message: undefined,
      },
    };
  }

  async componentDidMount() {
    const sdk = await ScanbotSdkService.instance.initialize();
    this.setState({ sdk: sdk });

    RoutingService.instance.observeChanges(() => {
      this.forceUpdate();
    });

    await ScanbotSdkService.instance.setLicenseFailureHandler((error: any) => {
      RoutingService.instance.reset();
      this.setState({ error: { message: error } });
      if (this._documentScanner?.isVisible()) {
        this._documentScanner?.pop();
      }
    });
  }

  onBackPress() {
    RoutingService.instance.back();
  }

  navigation?: any;

  toolbarHeight() {
    return (this.navigation as HTMLHeadingElement)?.clientHeight ?? 0;
  }

  containerHeight() {
    if (!this.navigation) {
      return "100%";
    }
    return window.innerHeight - 2 * this.toolbarHeight() ?? 0;
  }

  render() {
    return (
      <div>
        {this.documentScanner()}
       {/* {this.barcodeScanner()}
        {this.mrzScanner()}*/}

        <Toast
          alert={this.state.alert}
          onClose={() => this.setState({ alert: undefined })}
        />

        <AppBar
          position="fixed"
          ref={(ref) => (this.navigation = ref)}
          style={{ zIndex: 19 }}
        >
          <NavigationContent
            backVisible={!NavigationUtils.isAtRoot()}
            onBackClick={() => this.onBackPress()}
          />
        </AppBar>
        <div
          style={{
            height: this.containerHeight(),
            marginTop: this.toolbarHeight(),
          }}
        >
          {this.decideContent()}
        </div>
        <BottomBar
          hidden={NavigationUtils.isAtRoot()}
          height={this.toolbarHeight()}
        />
      </div>
    );
  }

  _documentScannerHtmlComponent: any;
  _documentScanner?: DocumentScannerComponent | null;
  documentScanner() {
    if (!this._documentScannerHtmlComponent) {
      this._documentScannerHtmlComponent = (
        <DocumentScannerComponent
          ref={(ref) => (this._documentScanner = ref)}
          sdk={this.state.sdk}

        />
      );
    }
    return this._documentScannerHtmlComponent;
  }

  decideContent() {
    const route = NavigationUtils.findRoute();

    if (
      NavigationUtils.isAtRoot() ||
      route === RoutePath.DocumentScanner ||
      route === RoutePath.BarcodeScanner
    ) {
      return (
        <div>
          <ErrorLabel message={this.state.error.message} />
          <FeatureList onItemClick={this.onFeatureClick.bind(this)} />
        </div>
      );
    }

    if (route === RoutePath.CroppingView) {
      if (!Pages.instance.hasActiveItem()) {
        RoutingService.instance.reset();
        return null;
      }
      return <CroppingPage sdk={this.state.sdk} />;
    }

    if (route === RoutePath.ImageDetails) {
      if (!Pages.instance.hasActiveItem()) {
        RoutingService.instance.reset();
        return null;
      }
      return <ImageDetailPage image={this.state.activeImage} />;
    }
    if (route === RoutePath.ImageResults) {
      return (
        <ImageResultsPage
          sdk={this.state.sdk}
          onDetailButtonClick={async (index: number) => {
            Pages.instance.setActiveItem(index);
            this.setState({
              activeImage:
                await ScanbotSdkService.instance.documentImageAsBase64(index),
            });
            RoutingService.instance.route(RoutePath.ImageDetails, {
              index: index,
            });
          }}
        />
      );
    }
  }

  formatBarcodes(codes: Barcode[]): string {
    return JSON.stringify(
      codes.map((code: Barcode) => code.text + " (" + code.format + ") ")
    );
  }

  printDataMatrixCodeToConsole (fileFormat: string, recognitionData: any) {
    console.log(`The scan result from ${fileFormat}:  ${JSON.stringify(recognitionData)}`);
  }

  async onFeatureClick(feature: any) {
    const valid = await ScanbotSdkService.instance.isLicenseValid();
    if (!valid) {
      console.error(
        "License invalid or expired. ScanbotSDK features not available"
      );
      return;
    }

    if (feature.id === RoutePath.LicenseInfo) {
      const info = await this.state.sdk?.getLicenseInfo();
      const color = info?.status === "Trial" ? "success" : "error";
      this.setState({ alert: { color: color, text: JSON.stringify(info) } });
    } else if (feature.id === RoutePath.BarcodeOnPng){
      // PNG CALL USED FOR POC
      const result = await ImageUtils.pick(ImageUtils.MIME_TYPE_PNG, document.getElementById(feature.id) as any, true);
      console.log('POC: Calling the PNG Detection Separately ')
      const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
          result.data
      );
      if (detection !== undefined) {
        //TODO: Move to separate function
        this.printDataMatrixCodeToConsole('PNG', detection.barcodes )
        this.setState({
          alert: {
            color: "success",
            text: this.formatBarcodes(detection.barcodes),
          },
        });
      }
      // SINGLE CALL FOR ALL SUPPORTED IMAGES...
    } else if (feature.id === RoutePath.BarcodeOnAllImages){
      console.log('Currently detecting PNG, JPG and PDF')
      let detection: any = '';
      const result = await ImageUtils.pick(ImageUtils.MIME_GENERIC_IMAGES, document.getElementById(feature.id) as any, true);
      if (result.fileType === 'application/pdf') {
        const images = await ImageUtils.pdfToImage(result.data);
        console.log(`Detected the following file format:  ${result.fileType}`);
        for (let i = 0; i < images.length; i++) {
            detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
              images[i]
          )
        }
      } else {
          detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
            result.data
        );
      }

      if (detection !== undefined) {
        this.printDataMatrixCodeToConsole(result.fileType , detection.barcodes )
        this.setState({
          alert: {
            color: "success",
            text: this.formatBarcodes(detection.barcodes),
          },
        });
      }
    }

   else if (feature.id === RoutePath.BarcodeOnJpeg) {
      const result = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG, document.getElementById(feature.id) as any, true);
      const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
        result.data
      );
      if (detection !== undefined) {
        this.printDataMatrixCodeToConsole('JPG' , detection.barcodes )
        this.setState({
          alert: {
            color: "success",
            text: this.formatBarcodes(detection.barcodes),
          },
        });
      }
    } else if (feature.id === RoutePath.BarcodeOnPdf) {
      const pdf = await ImageUtils.pick(ImageUtils.MIME_TYPE_PDF, document.getElementById(feature.id) as any, true);
      const images = await ImageUtils.pdfToImage(pdf.data);
      for (let i = 0; i < images.length; i++) {
        console.log(`Detect barcodes on page ${i}`);
        const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
          images[i]
        );
        if (detection !== undefined && detection.barcodes.length > 0) {
          this.printDataMatrixCodeToConsole('PDF', detection.barcodes )
          this.setState({
            alert: {
              color: "success",
              text: this.formatBarcodes(detection.barcodes),
            },
          });
        }
      }
    }
  }
}
