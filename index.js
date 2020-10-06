const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const objectId = require('mongodb').ObjectID;
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zeypn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());

// root 
app.get('/', (req, res) => {
    res.send('database working')
})

// mongodb
client.connect(err => {
  const activityCollection = client.db("volunteerActivity").collection("activity");
  const registerListCollection = client.db("volunteerActivity").collection("registerList");
  
  app.post("/addVolunteerActivity", (req, res) => {
    const volunteerActivity = req.body;
    activityCollection.insertOne(volunteerActivity)
    .then(result => {
      res.send(result.insertedCount)
    })
  })
  
  app.get('/volunteerActivity', (req, res) => {
    activityCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })


  // register to database
  app.post('/addRegister', (req, res) => {
    const register = req.body;
    registerListCollection.insertOne(register)
    .then(result => {
      res.send(result.insertedCount)
    })
  })

  app.get('/registerList/:email', (req, res) => {
    const userEmail = req.params.email;
    registerListCollection.find({email:userEmail})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  // delete activity 
  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    registerListCollection.deleteOne({_id: objectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount)
    })
  })

  // admin part read all user
  app.get('/allRegisterList', (req, res) => {
    registerListCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  
  // admin delete user
  app.delete('/deleteUserRegister/:id', (req, res) => {
    const id = req.params.id;
    registerListCollection.deleteOne({_id: objectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount)
    })
  })

});


const port = 5000;
app.listen(process.env.PORT || port)