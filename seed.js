const { MongoClient } = require('mongodb');

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://preciousonyechere3_db_user:BHWbWFEdAlcJnHhS@learningwebapp.axjgbei.mongodb.net/CourseApp?appName=LearningWebApp';

const lessons = [
  { title: 'Mathematics', slug: 'mathematics', location: 'Hendon', price: 100, spaces: 5, img: 'images/mths1.jpg', category: 'Math' },
  { title: 'Science Lab', slug: 'science-lab', location: 'Colindale', price: 95, spaces: 5, img: 'images/sci-lab2.jpg', category: 'Science' },
  { title: 'Music', slug: 'music', location: 'Brent Cross', price: 80, spaces: 5, img: 'images/music3.jpg', category: 'Music' },
  { title: 'Programming', slug: 'programming', location: 'Online', price: 120, spaces: 5, img: 'images/pgm1.jpg', category: 'Coding' },
  { title: 'Art & Design', slug: 'art-design', location: 'Golders Green', price: 70, spaces: 5, img: 'images/art-d.jpg', category: 'Arts' },
  { title: 'Football', slug: 'football', location: 'Hendon', price: 50, spaces: 5, img: 'images/fball1.jpg', category: 'Sports' },
  { title: 'English Literature', slug: 'english-lit', location: 'Colindale', price: 85, spaces: 5, img: 'images/e-lit1.jpg', category: 'English' },
  { title: 'Advanced Maths', slug: 'advanced-maths', location: 'Brent Cross', price: 130, spaces: 5, img: 'images/adv-mths.jpg', category: 'Math' },
  { title: 'Drama Club', slug: 'drama-club', location: 'Golders Green', price: 60, spaces: 5, img: 'images/drama4.jpg', category: 'Arts' },
  { title: 'Robotics and Tech', slug: 'robotics-tech', location: 'Online', price: 140, spaces: 5, img: 'images/rob-tec3.jpg', category: 'Coding' }
];

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log('Connecting to', MONGO_URI);
    await client.connect();

    const db = client.db();
    const col = db.collection('lessons');

    await col.deleteMany({});
    await col.insertMany(lessons);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
    console.log('Finished seeding.');
  }
}

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seed, lessons };
