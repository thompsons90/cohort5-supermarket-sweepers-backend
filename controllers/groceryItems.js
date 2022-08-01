const fs = require('fs');

///Initialize Firestore
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert } = require('firebase-admin/app');
initializeApp({
  credential: cert('./controllers/serviceAccount.json')
});
const db = getFirestore();

// exports.getGroceryItems = (req, res) => {
//   const { groceryItems } = JSON.parse(fs.readFileSync('dummyData.json', 'utf-8'));
//   let searchResults = groceryItems;

//   if (req.query && req.query.q) {
//     let q = req.query.q;
//     searchResults = searchResults.filter((item) => item.name.toLowerCase().includes(q));
//   }

//   if (req.query && req.query.store) {
//     let store = req.query.store;
//     searchResults = searchResults.filter((item) => item.store === store);
//   }

//   if (req.query && req.query.type) {
//     let type = req.query.type;
//     searchResults = searchResults.filter((item) => item.type === type);
//   }

//   res.status(200).json({ groceryItems: searchResults, numResults: searchResults.length });
// };

///Async functions that get data from fireStore for the groceryItems in the routes folder
exports.getMeatDataCollectionFromFirestore = async(req, res) =>{
  let documentRef = db.collection('meatData').doc('meat');
  let doc = await documentRef.get();
  doc = doc._fieldsProto.combinedJSON.arrayValue.values

  ///Express Queries
  if(req.query && req.query.store){
    let store = req.query.store
    doc = await doc.filter((item) => item.mapValue.fields.store.stringValue === store)
  }
  if(req.query && req.query.name){
    let name = req.query.name
    doc = await doc.filter((item) => item.mapValue.fields.name.stringValue === name)
  }
  if(req.query && req.query.type){
    let type = req.query.type
    doc = await doc.filter((item) => item.mapValue.fields.type.stringValue === type)
  }
  if(req.query && req.query.option){
    let option = req.query.option
    doc = await doc.filter((item) => item.mapValue.fields.option.stringValue === option)
  }

  res.send(doc)
}

exports.getWalmartCollectionFromFirestore = async(req, res) =>{
  let documentRef = db.collection('Walmart').doc('meat');
  let doc = await documentRef.get();
  doc = doc._fieldsProto.walmartJSON.arrayValue.values

  ///Express Queries
  if(req.query && req.query.name){
    let name = req.query.name
    doc = await doc.filter((item) => item.mapValue.fields.name.stringValue === name)
  }
  if(req.query && req.query.type){
    let type = req.query.type
    doc = await doc.filter((item) => item.mapValue.fields.type.stringValue === type)
  }
  if(req.query && req.query.option){
    let option = req.query.option
    doc = await doc.filter((item) => item.mapValue.fields.option.stringValue === option)
  }

  res.send(doc)
}

exports.getKrogerCollectionFromFirestore = async(req, res) =>{
  let documentRef = db.collection('Kroger').doc('meat');
  let doc = await documentRef.get();

  ///Express Queries
  if(req.query && req.query.name){
    let name = req.query.name
    doc = await doc.filter((item) => item.mapValue.fields.name.stringValue === name)
  }
  if(req.query && req.query.type){
    let type = req.query.type
    doc = await doc.filter((item) => item.mapValue.fields.type.stringValue === type)
  }
  if(req.query && req.query.option){
    let option = req.query.option
    doc = await doc.filter((item) => item.mapValue.fields.option.stringValue === option)
  }

  res.send(doc)
}