# Proof of Concept.
The purpose of this concept, is to determine if it is possible to have Datamatrix extraction on the frontend side, instead the 
backend that we use for this purpose.

This PoC is 95% boilerplate from the original Scanbot company demo. 
It consist of the following:
- Boilerplate (React setup) (We already do it)
- Instantiating the scanbot for usage (We already do it)
- Detecting the Datamatrix Code (App.tsx and image-utils.ts) - PoC code, only in those two files.

### Some notes about the code
**App.tsx** contains the actual implementation. From line 180, the actual implementation starts.
We have separate implementations for PNG, JPG and PDF, so it is easier to follow the implementation. 
And then we have one method that supports all formats (Line 197),
this code should be called with button upload.

### Origins
This PoC is based on ScanBot demo project, where they cover all features they offer.

**image-utils** contains pdf transformation code.

### Test Images
We have all possible formats, and you can find them in mocks/Files_for_poc.
Also, we have a folder distorted, where we applied intantional distortions to image, in order to see,
will it be recognized. So far it works.

### sb_poc how to start the project
In this project, we tried to capture only those things that we need.
Expose them on line, so the Apps can be tested. Also, aim is to make it KISS.

### Extra Libraries
THis project uses two additional libraries (both used in image-utils), and they are:
- "react-pdf": "5.3.0",
- const pdfWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.js`;

### How to run the example apps?
The React example app relies on the `npm` [package](https://www.npmjs.com/package/scanbot-web-sdk)
of the Scanbot Web Document Scanner SDK.

To run the React example app:
```
cd app/
npm install
npm start
```
It should run on localhost:3000

to shut down the app:
```
npm eject
```

### Where is this project hosted
https://vercel.com/. Any commit to the main branch, will be deployed to production (https://sb-poc.vercel.app/#/).
The reason why this built in a private account is to gain speed. 
Private account works smoothly with Vercel. And this is after all an PoC.


### Online availability
You can find the app here:
```
https://sb-poc.vercel.app/#/
```