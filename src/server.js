import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userProfileSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  specialNeeds: {
    type: [String],
    default: [],
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

app.post('/api/user-data', async (req, res) => {
  console.log('Received POST request to /api/user-data');

  try {
    const { clerkId, age, gender, specialNeeds, weight, height } = req.body;

    console.log('Extracted parameters:', { clerkId, age, gender, specialNeeds, weight, height });

    if (!clerkId || !age || !gender || !weight || !height) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof age !== 'number' || typeof weight !== 'number' || typeof height !== 'number') {
      return res.status(400).json({ error: 'Age, Weight, and Height must be numbers' });
    }

    console.log('Checking for existing profile...');
    const existingProfile = await UserProfile.findOne({ clerkId });
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists' });
    }

    console.log('Creating new profile...');
    const newProfile = new UserProfile({
      clerkId,
      age,
      gender,
      specialNeeds,
      weight,
      height,
    });

    console.log('Saving new profile...');
    await newProfile.save();

    console.log('Profile saved successfully');
    res.status(201).json({ message: 'Profile saved successfully', userId: clerkId });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/check-user-data/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const existingProfile = await UserProfile.findOne({ clerkId: userId });
    res.status(200).json({ exists: !!existingProfile });
  } catch (error) {
    console.error('Error checking user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/user-profiles', async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the NutriLens API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));