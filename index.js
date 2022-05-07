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
    app.get('/item/:id', async (req, res) => {
      const query = {
        _id: ObjectId(req.params.id)
      };
      console.log(req.params.id);
      const item = await productCollection.findOne(query);
      res.send(item);
    });
  } finally { }
}
run().catch(console.dir);

app.listen(port, () => console.log('Listening to port ', port));