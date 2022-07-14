const fs = require('fs');

exports.getGroceryItems = (req, res) => {
  const { groceryItems } = JSON.parse(fs.readFileSync('dummyData.json', 'utf-8'));
  let searchResults = groceryItems;

  if (req.query && req.query.q) {
    let q = req.query.q;
    searchResults = searchResults.filter((item) => item.name.toLowerCase().includes(q));
  }

  if (req.query && req.query.store) {
    let store = req.query.store;
    searchResults = searchResults.filter((item) => item.store === store);
  }

  if (req.query && req.query.minor_category) {
    let minorCategory = req.query.minor_category;
    searchResults = searchResults.filter((item) => item.minorCategory === minorCategory);
  }

  res.status(200).json({ groceryItems: searchResults, numResults: searchResults.length });
};
