// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false, // Este servirá cuando el proyecto ya se esté ejecutando por parte del cliente 
  
   firebase: 
   {
    apiKey: "AIzaSyA5aTQ0ZYKU0B9FpHJm341Ve_tptZ1_vkQ",
    authDomain: "libreriajatziri.firebaseapp.com",
    projectId: "libreriajatziri",
    storageBucket: "libreriajatziri.appspot.com",
    messagingSenderId: "309189079353",
    appId: "1:309189079353:web:15f5028c4edcc90052f8e8",
    measurementId: "G-09GECF7VEQ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
