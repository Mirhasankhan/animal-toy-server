const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express();

//middlewares
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://animalToys:Oh3CP8qVOxbxgTrW@cluster0.cpvrkgd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const animalCollection = client.db('animalDB').collection('animal');
        const imageCollection = client.db('galleryImage').collection('images')

        app.get('/images', async(req, res)=>{
            const result = await imageCollection.find().toArray()
            res.send(result)
        })
       


        // animal collection operations
        app.get('/allToy', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await animalCollection.find(query).limit(20).sort({price: 1}).toArray()
            res.send(result)
        })
       
        app.get('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await animalCollection.findOne(query)
            res.send(result)
        })

        app.post('/addToy', async (req, res) => {
            const body = req.body;
            const result = await animalCollection.insertOne(body)
            res.send(result)
        })

        app.delete('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await animalCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body;
            
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,                  
                    description: updatedToy.description  ,                  
                    email: updatedToy.email,
                    seller: updatedToy.seller,                  
                    toy: updatedToy.toy,
                    rating: updatedToy.rating                   
                }
            }
            const result = await animalCollection.updateOne(filter, toy, options);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('animal server ')
})

app.listen(port, () => {
    console.log('server running at 5000');
})