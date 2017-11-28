This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

Add `firebase` dependency to your project:
```bash
$ sudo npm install firebase --save
```

Run `ionic build`, if it cannot find `promise-polyfill` run this in your command line:   
```bash
$ sudo npm install promise-polyfill --save-exact
```

Ionic Firebase native Plugin:
```
$ ionic cordova plugin add cordova-plugin-firebase
$ npm install --save @ionic-native/firebase
```

<a href="https://firebase.google.com/docs/reference/node/">Firebase Api</a>   

Tutorials:   
<a href="https://firebase.google.com/docs/database/web/start">Firebase Web</a>,   
<a href="https://firebase.google.com/docs/reference/js/firebase.database.Query">Query interface</a>

Install Json-Ignore Library
```
npm install json-ignore --save
```

Install  Node.js
```
 npm install @types/node --save-dev
```

Install CryptoJs
```
npm install crypto-js
```

Install Ionic Screen Orientation
(ionic cordova plugin add cordova-plugin-screen-orientation)
```
npm install --save @ionic-native/screen-orientation
```

TranslationService
```
npm install @ngx-translate/core @ngx-translate/http-loader --save
```

moment library for dateformat:
```
npm install --save moment
```

Cloud Messaging / Push
```
cordova plugin add cordova-plugin-fcm
```
Globalization
npm install --save @ionic-native/globalization
```

