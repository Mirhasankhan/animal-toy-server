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

        // get single user data
        app.get('/allToy', async(req, res)=>{
            let query = {};
            if(req.query?.email){
                query = {email: req.query.email}
            }
            const result = await animalCollection.find(query).toArray();
            res.send(result)
        })      

        // get a single data
        app.get('/allToy/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await animalCollection.findOne(query)
            res.send(result)
        })

        app.post('/addToy', async(req, res)=>{
            const body = req.body;
            const result = await animalCollection.insertOne(body)
            res.send(result)
        })
        app.delete('/allToy/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await animalCollection.deleteOne(query)
            res.send(result)
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