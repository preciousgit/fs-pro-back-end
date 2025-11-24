const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb+srv://preciousonyechere3_db_user:BHWbWFEdAlcJnHhS@learningwebapp.axjgbei.mongodb.net/?appName=LearningWebApp';
const client = new MongoClient(uri);
let lessonsCollection;
let ordersCollection;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/lessons', async (req, res) => {
    try {
        const lessons = await lessonsCollection.find({}).toArray();
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});



async function start() {
    try {
        await client.connect();
        const db = client.db('CourseApp');
        lessonsCollection = db.collection('lessons');
        ordersCollection = db.collection('orders');
        

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

start();
