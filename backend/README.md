# Sketch Sight Backend

This is the backend server for the Sketch Sight application, providing face and sketch recognition capabilities using FaceNet and MongoDB.

## Features

- **Face Recognition**: Add and recognize faces/sketches using AI-powered embeddings
- **MongoDB Integration**: Store face embeddings and images using MongoDB Atlas and GridFS
- **RESTful API**: Clean API endpoints for all operations
- **File Upload**: Support for image uploads with validation (PNG, JPG, JPEG, GIF, BMP)
- **Configurable Thresholds**: Adjustable recognition and rejection thresholds
- **Environment-based Configuration**: All settings configurable via environment variables

## Prerequisites

- Python 3.8 or higher
- MongoDB Atlas account
- pip package manager

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   The `.env` file is already configured with your MongoDB credentials:
   ```env
   MONGO_URI=mongodb+srv://eye-dentify:hEC0Hpcrv98THlAlf@eye-dentity.sgrj54e.mongodb.net/?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE&tls=true&tlsAllowInvalidCertificates=true
   MONGO_DB_NAME=face_recognition_db
   MONGO_COLLECTION_NAME=faces
   ```

3. **Start the development server:**
   ```bash
   python run.py
   ```
   
   Or use Flask directly:
   ```bash
   python app.py
   ```

4. **For production:**
   ```bash
   gunicorn app:create_app()
   ```

## Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.py        # MongoDB connection
│   └── face_recognition_config.py # Face recognition settings
├── controllers/           # Business logic
│   └── face_controller.py  # Face operations controller
├── middleware/            # Custom middleware
│   └── error_handler.py    # Error handling
├── routes/                # API route handlers
│   └── face_routes.py      # Face recognition routes
├── utils/                 # Utility functions
│   ├── face_recognition.py # Face recognition utilities
│   └── database_ops.py     # Database operations
├── app.py                 # Main Flask application
├── run.py                 # Simple startup script
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Configuration

The application uses environment variables for all configuration. Key settings include:

### MongoDB Configuration
- `MONGO_URI`: MongoDB Atlas connection string
- `MONGO_DB_NAME`: Database name (face_recognition_db)
- `MONGO_COLLECTION_NAME`: Collection name (faces)

### Face Recognition Configuration
- `RECOGNITION_THRESHOLD`: Minimum similarity score for recognition (0.60)
- `REJECTION_THRESHOLD`: Minimum score below which to reject (0.50)
- `FACE_IMAGE_SIZE`: Processing image size (160)
- `MAX_FILE_SIZE`: Maximum file size in bytes (16777216 = ~16MB)

### Supported File Formats
- PNG, JPG, JPEG, GIF, BMP

## API Endpoints

### Face Recognition

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| `POST` | `/api/face/add` | Add a new face/sketch | `image` (file), `name` (string) |
| `POST` | `/api/face/recognize` | Recognize a face/sketch | `image` (file) |
| `PUT` | `/api/face/thresholds` | Adjust recognition thresholds | `recognitionThreshold`, `rejectionThreshold` |
| `DELETE` | `/api/face/clear` | Clear all database entries | None |
| `GET` | `/api/face/count` | Count database entries | None |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API documentation with configuration |
| `GET` | `/health` | Health check with system info |

## Usage Examples

### Add a Face/Sketch
```bash
curl -X POST http://localhost:5000/api/face/add \
  -F "image=@path/to/image.jpg" \
  -F "name=John Doe"
```

### Recognize a Face/Sketch
```bash
curl -X POST http://localhost:5000/api/face/recognize \
  -F "image=@path/to/image.jpg"
```

### Adjust Thresholds
```bash
curl -X PUT http://localhost:5000/api/face/thresholds \
  -H "Content-Type: application/json" \
  -d '{"recognitionThreshold": 0.70, "rejectionThreshold": 0.60}'
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

- **Hot Reload**: Use `python run.py` for development
- **Logging**: Console logging for debugging
- **File Cleanup**: Temporary uploads are automatically cleaned up
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Configuration**: All settings can be modified via environment variables

## Troubleshooting

1. **MongoDB connection issues**: Check your connection string in `.env`
2. **Image processing errors**: Ensure images are valid and under 16MB
3. **Port conflicts**: Change `PORT` in `.env` if 5000 is already in use
4. **File format errors**: Check that your image is in supported format (PNG, JPG, JPEG, GIF, BMP)
5. **Dependency issues**: Make sure all requirements are installed with `pip install -r requirements.txt`

## Security Notes

- File uploads are validated for type and size
- Temporary files are automatically cleaned up
- CORS is configurable via environment variables
- Environment variables should be properly secured in production
- Rate limiting can be configured via `RATE_LIMIT_PER_MINUTE`

## License

ISC
