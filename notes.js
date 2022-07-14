/* GROCERY ITEM SCHEMA

const exampleGroceryItem = {
  name: string,
  unitSize: string,
  totalPrice: number(float),
  pricePerOz?: number(float),  // optional, we will probably have to calculate this ourselves, it may not be available for all items
  store: 'marketStreet' | 'kroger' | 'walmart',
  mainCategory: 'meat' | 'produce', // only two categories for now, we can add more later
  minorCategory: string, // groundBeef would be any example of a minor category. Allows us to place items in groups 
};
*/

/* 
We will use a json database for right now to simulate using the real one.  We will read from a file called dummyData.json to provide data to the api routes for now

The dummyData.json file will consist of a large array of groceryItems following this schema. 
We will have to create functions that query this dummy database in order to provide data for our routes.
These functions will later be replaced with functions that use the firebase database.
 */
