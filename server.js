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
        console.error('Error creating lessons:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
});

app.put('/lessons/:id', async (req, res) => {
    const { id } = req.params;
    
    // Check if request body exists and is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            error: 'Invalid request',
            details: 'Request body is missing or empty' 
        });
    }

    try {
        // Create a new object to avoid modifying the original request
        const updates = { ...req.body };
        
        // Remove _id if it exists to prevent modification
        if (updates._id) {
            delete updates._id;
        }

        // Add updated timestamp
        updates.updatedAt = new Date();

        const result = await lessonsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Return the updated document
        const updatedLesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });
        res.json(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ 
            error: 'Failed to update lesson',
            details: error.message 
        });
    }
});

// Order routes
app.post('/orders', async (req, res) => {
    try {
        const { name, phone, lessonIDs, numberOfSpace } = req.body;
        
        // Basic validation
        if (!name || !phone || !lessonIDs || !Array.isArray(lessonIDs) || lessonIDs.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid request',
                details: 'Name, phone, and at least one lesson ID are required' 
            });
        }

        // Create order with timestamp
        const order = {
            name,
            phone,
            lessonIDs,
            numberOfSpace,
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert order into database
        const result = await ordersCollection.insertOne(order);
        
        // Update lesson spaces for each lesson in the order
        for (const lessonId of lessonIDs) {
            await lessonsCollection.updateOne(
                { _id: new ObjectId(lessonId) },
                { $inc: { spaces: -numberOfSpace } }
            );
        }

        // Return the created order with its ID
        res.status(201).json({
            _id: result.insertedId,
            ...order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            details: error.message 
        });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const { phone } = req.query;
        let query = {};
        
        // If phone is provided, filter orders by phone number
        if (phone) {
            query.phone = phone;
        }
        
        const orders = await ordersCollection.find(query).toArray();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch orders',
            details: error.message 
        });
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
