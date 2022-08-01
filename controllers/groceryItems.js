const fs = require('fs');
require('dotenv').config();

///Initialize Firestore
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert } = require('firebase-admin/app');

initializeApp({
  credential: cert('./controllers/serviceAccount.json'),
});

///
///JSON.parse(process.env.FIREBASE_CONFIG)

const db = getFirestore();

///Async functions that get data from fireStore for the groceryItems in the routes folder
exports.getMeatDataCollectionFromFirestore = async (req, res) => {
  let documentRef = db.collection('meatData');
  let searchString = undefined;
  let query = documentRef;

  // applies filters
  if (req.query && req.query.store) {
    query = documentRef.where('store', '==', req.query.store);
  }

  if (req.query && req.query.type) {
    query = documentRef.where('type', '==', req.query.type);
  }

  if (req.query && req.query.option) {
    query = documentRef.where('option', '==', req.query.option);
  }

  if (req.query && req.query.order) {
    let orderInfo = req.query.order.split('-');
    query = documentRef.orderBy(orderInfo[0], orderInfo[1]);
  }

  if (req.query && req.query.q) {
    searchString = req.query.q;
  }

  try {
    let results = await query.get();

    let formattedData = [];
    results.forEach((item) => {
      let formattedItem = item.data();

      if (searchString) {
        if (formattedItem.name.toLowerCase().includes(searchString.toLowerCase())) {
          formattedData.push(formattedItem);
        }
      } else {
        formattedData.push(formattedItem);
      }
    });

    res.status(200).json({ totalResults: formattedData.length, results: formattedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching the data.' });
  }
};

exports.getWalmartCollectionFromFirestore = async (req, res) => {
  let documentRef = db.collection('Walmart').doc('meat');
  let doc = await documentRef.get();
  doc = doc._fieldsProto.walmartJSON.arrayValue.values;

  ///Express Queries
  if (req.query && req.query.name) {
    let name = req.query.name;
    doc = await doc.filter((item) => item.mapValue.fields.name.stringValue === name);
  }
  if (req.query && req.query.type) {
    let type = req.query.type;
    doc = await doc.filter((item) => item.mapValue.fields.type.stringValue === type);
  }
  if (req.query && req.query.option) {
    let option = req.query.option;
    doc = await doc.filter((item) => item.mapValue.fields.option.stringValue === option);
  }

  res.send(doc);
};

exports.getKrogerCollectionFromFirestore = async (req, res) => {
  let documentRef = db.collection('Kroger').doc('meat');
  let doc = await documentRef.get();

  ///Express Queries
  if (req.query && req.query.name) {
    let name = req.query.name;
    doc = await doc.filter((item) => item.mapValue.fields.name.stringValue === name);
  }
  if (req.query && req.query.type) {
    let type = req.query.type;
    doc = await doc.filter((item) => item.mapValue.fields.type.stringValue === type);
  }
  if (req.query && req.query.option) {
    let option = req.query.option;
    doc = await doc.filter((item) => item.mapValue.fields.option.stringValue === option);
  }

  res.send(doc);
};
