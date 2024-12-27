import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scanDir = path.join(__dirname, 'components', 'scan');
try {
  await fs.access(scanDir);
  console.log('Scan directory exists:', true);
} catch (err) {
  if (err.code === 'ENOENT') {
    await fs.mkdir(scanDir, { recursive: true });
    console.log('Created scan directory');
  } else {
    throw err;
  }
}

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
const History = mongoose.model('History', userProfileSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, scanDir);
  },
  filename: (req, file, cb) => {
    cb(null, `cropped-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/api/user-data', async (req, res) => {
  console.log('Received POST request to /api/user-data');

  try {
    const { clerkId, age, gender, specialNeeds, weight, height } = req.body;

    if (!clerkId || !age || !gender || !weight || !height) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingProfile = await UserProfile.findOne({ clerkId });
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists' });
    }

    const newProfile = new UserProfile({
      clerkId,
      age,
      gender,
      specialNeeds,
      weight,
      height,
    });

    await newProfile.save();
    res.status(201).json({ message: 'Profile saved successfully', userId: clerkId });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const tempFilePath = req.file.path;
    const targetFileName = 'table-image.png';
    const targetFilePath = path.join(scanDir, targetFileName);

    try {
      await fs.access(targetFilePath);
      await fs.unlink(targetFilePath);
      console.log('Deleted existing table-image.png');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    await fs.rename(tempFilePath, targetFilePath);

    console.log('File renamed and moved to:', targetFilePath);
    res.status(200).json({ message: 'File uploaded and renamed successfully', filePath: targetFilePath });
  } catch (error) {
    console.error('Error handling file:', error);
    res.status(500).json({ error: 'Failed to handle file' });
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