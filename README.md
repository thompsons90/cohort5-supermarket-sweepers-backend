# API DOCS

## Running the server locally

1. First, clone the repo
2. After cloning the repo, run `npm install`
3. In the terminal at the base director of the project, run `npm start`. This will start the node server with nodemon. The server will be running on local host 3001. You should see a message is running in the dev console to confirm the server is up and running.

## Api Routes (local)

#### localhost:3001/api/heartbeat [GET]

- returns 200 status code and the following JSON `{ "message": "api up and running"}`

#### localhost:3001/api/groceryitems [GET]

- returns 200 status code and all the grocery items from the data base along with the number of results

#### localhost:3001/api/walmartData [GET]

- Returns all data from walmart

#### localhost:3001/api/krogerData [GET]

- Returns all data from kroger

#### localhost:3001/api/meatData [GET]

- Returns all data from all stores

#### can add queries to url to filter results

- q=[string that searches through the names of grocery items] \n
- store=[must be walmart or marketstreet] -> will add more later \n
- minor_category=[must be chicken or groundBeef] -> will add more later \n

### example request

#### localhost:3001/api/groceryitems?q=family&store=walmart&minor_category=groundBeef

#### localhost:3001/api/meatData?store=walmart&type=beef

