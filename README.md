# Ultra BG Remover - Backend API

Free, self-hosted background removal API using AI models.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs on: `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Remove Background
```
POST /remove-background
Content-Type: multipart/form-data

Field: image (file)
```

**Response:**
```json
{
  "success": true,
  "image": "base64_encoded_png_image",
  "mimeType": "image/png",
  "size": 123456
}
```

## 🔧 Features

- ✅ **100% Free** - Uses @imgly/background-removal-node (free, open-source)
- ✅ **AI-Powered** - U²-Net based neural network
- ✅ **Works for All Images** - People, products, animals, objects
- ✅ **Fast Processing** - ~2-5 seconds per image
- ✅ **PNG Output** - Transparent background
- ✅ **No API Keys** - Self-hosted, no external dependencies

## 📊 Performance

- **Image Size Limit**: 10MB
- **Processing Time**: 2-5 seconds (depending on image size)
- **Output Format**: PNG with transparency
- **Quality**: High (90%)

## 🌐 Deployment Options

### Local (Development)
```bash
npm start
```

### Production (PM2)
```bash
npm install -g pm2
pm2 start server.js --name ultrabg-api
pm2 save
pm2 startup
```

### Cloud (Heroku)
```bash
heroku create ultrabg-api
git push heroku main
```

### Cloud (Railway/Render)
- Connect GitHub repo
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && npm start`

## 🔗 Android App Integration

Update your Android app to send images to this API:

```java
// In EditorActivity.java
private void processImageWithAPI(Bitmap bitmap) {
    // Convert bitmap to file
    File imageFile = saveBitmapToFile(bitmap);
    
    // Send to API
    OkHttpClient client = new OkHttpClient();
    RequestBody requestBody = new MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("image", imageFile.getName(),
            RequestBody.create(imageFile, MediaType.parse("image/*")))
        .build();
    
    Request request = new Request.Builder()
        .url("http://YOUR_SERVER:3000/remove-background")
        .post(requestBody)
        .build();
    
    client.newCall(request).enqueue(new Callback() {
        @Override
        public void onResponse(Call call, Response response) {
            // Parse response and display result
        }
    });
}
```

## 💰 Cost Comparison

| Solution | Cost |
|----------|------|
| **Our Backend (Self-Hosted)** | $0/month ✅ |
| Remove.bg API | $9-299/month ❌ |
| Cloudinary AI | $99+/month ❌ |
| AWS Rekognition | ~$1/1000 images ❌ |

## 🛠️ Tech Stack

- **Framework**: Express.js
- **AI Model**: @imgly/background-removal-node (U²-Net)
- **Image Processing**: Sharp
- **File Upload**: Multer
- **CORS**: Enabled for mobile apps

## 📝 Notes

- First request may take longer (~10s) as model downloads
- Model is cached after first use
- Works completely offline after initial setup
- No external API calls
- Privacy-friendly (images processed locally)

---

**Built with ❤️ for Ultra BG Remover Android App**
