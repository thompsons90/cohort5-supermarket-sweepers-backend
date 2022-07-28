const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var walmartJSON = require('../data/walmartJSON.json')
let krogerJSON = require('../krogerData.json')

// const firebaseConfig = {
//     apiKey: process.env.apiKey,
//     authDomain: process.env.authDomain,
//     projectId: process.env.projectId,
//     storageBucket: process.env.storageBucket,
//     messagingSenderId: process.env.messagingSenderId,
//     appId: process.env.appId,
//     measurementId: process.env.measurementId
// };



initializeApp({
    credential: cert('./serviceAccount.json')
  });
const db = getFirestore();

// Writes JSON data to firestore database
async function exportWalmartDataToWalmartCollection() {
    const docRef = db.collection('Walmart').doc('meat');

    await docRef.set({walmartJSON});
}
async function exportKrogerDataToKrogerCollection() {
    const docRef = db.collection('Kroger').doc('meat');

    await docRef.set({krogerJSON});
}
async function exportAllJSONToMeatDataCollection(){
    const docRef = db.collection('meatData').doc('meat');
    let combinedJSON = walmartJSON.concat(krogerJSON)

    await docRef.set({combinedJSON});
}


exportWalmartDataToWalmartCollection();
exportKrogerDataToKrogerCollection()
exportAllJSONToMeatDataCollection()