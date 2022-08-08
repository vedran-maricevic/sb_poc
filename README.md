# Proof of Concept.
This proof of concepts aim, is to show it is possible to have Datamatrix. code recognition moved to the
front end side. Currently, we use backend for this purpose. 

### Origins
This PoC is based on ScanBot demo project, where they cover all bangs and whistles. However, we stripped all of that.
Kept exactly what we need, and implemented the missing things.

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


### Online availability
You can find the app here:
```
https://sb-poc.vercel.app/#/
```