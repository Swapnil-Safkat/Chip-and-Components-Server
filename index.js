const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Connected with Chip & Comps'));

const uri = `mongodb+srv://${process.env.DB_USER
  }:${process.env.DB_PASS
  }@learningmongo.qf50z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db('ChipAndComps').collection('Products');
    //get all items
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //get 6 items
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({});
      const services = await cursor.limit(6).toArray();
      res.send(services);
    });
    // add a new service to mongo
    app.post('/products', async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });
    //get a single product from id
    app.get('/inventory/:id', async (req, res) => {
      const query = {
        _id: ObjectId(req.params.id)
      };
      const item = await productCollection.findOne(query);
      res.send(item);
    });
   
    //update a product stock
    app.put('/item/:id', async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedItem
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })
    // delete a item
    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })
  } finally { }
}
run().catch(console.dir);

app.listen(port, () => console.log('Listening to port ', port));