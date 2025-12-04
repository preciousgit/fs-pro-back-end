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

// Serve static files from `public` (images are under `public/images`)
const publicPath = path.join(__dirname, 'public');
app.use('/images', express.static(path.join(publicPath, 'images')));

// Logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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

// Search endpoint
app.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q?.trim();
        if (!searchTerm || searchTerm.length === 0) {
            return res.json([]); // Empty search returns empty
        }

        const searchRegex = new RegExp(searchTerm, 'i');
        const results = await lessonsCollection.find({
            $or: [
                { title: searchRegex },
                { location: searchRegex },
                { category: searchRegex },
                { price: isNaN(Number(searchTerm)) ? null : Number(searchTerm) }
            ]
        }).toArray();

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

app.post('/lessons', async (req, res) => {
    try {
        const lessons = req.body;
        const result = await lessonsCollection.insertOne(lessons);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
});

app.put('/lessons/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await lessonsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ error: 'Failed to update lesson' });
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
