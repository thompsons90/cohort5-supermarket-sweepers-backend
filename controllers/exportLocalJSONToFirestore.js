const fs = require('fs');
require('dotenv').config({path: "../.env"});
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// const walmartArr = JSON.parse(fs.readFileSync('data/walmartJSON.json', 'utf-8'));
// const krogerArr = JSON.parse(fs.readFileSync('krogerData.json', 'utf-8'));

var walmartJSON = require('../data/walmartJSON.json');
let krogerJSON = require('../krogerData.json');

console.log(__dirname)

initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});
const db = getFirestore();

// Writes JSON data to firestore database
async function exportWalmartDataToWalmartCollection() {
  const docRef = db.collection('Walmart').doc('meat');

  await docRef.set(walmartJSON);

  //await docRef.set({walmartJSON});
}
async function exportKrogerDataToKrogerCollection() {
  const docRef = db.collection('Kroger').doc('meat');

  await docRef.set(krogerJSON);

  //await docRef.set({krogerJSON});
}
async function exportAllJSONToMeatDataCollection() {
  const docRef = db.collection('meatInOneDoc').doc('meatData');
  let combinedData = [...walmartJSON, ...krogerJSON];

  console.log(combinedData.length)
  // await docRef.set({combinedData})
  // for (let i = 0; i < combinedData.length; i++) {
  //   db.collection('meatData').add(combinedData[i]);
  // }

  //await docRef.set(combinedJSON);

  // await docRef.set({combinedJSON});
}

console.log('started uploading data to firebase');
//exportWalmartDataToWalmartCollection();
// exportKrogerDataToKrogerCollection();
exportAllJSONToMeatDataCollection();

console.log('ended uploading data to firebase');
