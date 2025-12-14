const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { removeBackground } = require('@imgly/background-removal-node');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = './uploads';
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Ultra BG Remover API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            removeBackground: 'POST /remove-background (multipart/form-data with "image" field)'
        },
        message: 'API is working! Use POST /remove-background to process images.'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Ultra BG Remover API is running' });
});

// Background removal endpoint
app.post('/remove-background', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log(`Processing image: ${req.file.filename}`);
        const inputPath = req.file.path;

        // Read the uploaded image
        const imageBuffer = await fs.readFile(inputPath);

        // Remove background using AI
        console.log('Removing background...');
        const resultBlob = await removeBackground(imageBuffer);

        // Convert Blob to Buffer
        const arrayBuffer = await resultBlob.arrayBuffer();
        const resultBuffer = Buffer.from(arrayBuffer);

        // Optimize with sharp
        const optimizedBuffer = await sharp(resultBuffer)
            .png({ quality: 90, compressionLevel: 6 })
            .toBuffer();

        // Clean up uploaded file
        await fs.unlink(inputPath).catch(() => { });

        // Send the result as base64
        const base64Image = optimizedBuffer.toString('base64');

        console.log(`Background removed successfully! Size: ${(optimizedBuffer.length / 1024).toFixed(2)}KB`);

        res.json({
            success: true,
            image: base64Image,
            mimeType: 'image/png',
            size: optimizedBuffer.length
        });

    } catch (error) {
        console.error('Error removing background:', error);

        // Clean up file if it exists
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }

        res.status(500).json({
            error: 'Failed to remove background',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Ultra BG Remover API server running on http://localhost:${PORT}`);
    console.log(`📸 Ready to process images!`);
    console.log(`💡 Use POST /remove-background with 'image' file field`);
});
