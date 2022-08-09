# Proof of Concept.
This proof of concepts aim, is to show it is possible to have Datamatrix. code recognition moved to the
front end side. Currently, we use backend for this purpose. 

### Origins
This PoC is based on ScanBot demo project, where they cover all features they offer. However, we stripped most of it.
Kept exactly what we need, and implemented the missing things.

**App.tsx** contains the actual implementation. From line 180, the actual implementation starts.
We have separate implementations for PNG, JPG and PDF, so it is easier to follow the implementation. 
And then we have one method that supports all formats (Line 197),
this code should be called with button upload

### sb_poc start the project
In this project, we tried to capture only those things that we need.
Expose them on line, so the Apps can be tested. Also, aim is to make it KISS.

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

### Online availability
You can find the app here:
```
https://sb-poc.vercel.app/#/
```