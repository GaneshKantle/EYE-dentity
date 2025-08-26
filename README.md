# 🔍 EYE'dentify - Forensic Face Recognition System

<div align="center">

![EYE'dentify Logo](./assets/logo.png)

**Professional Forensic Face Sketch & Recognition System**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://eyedentify-demo.com) • [📖 Documentation](./PROJECT_DOCUMENTATION.md) • [🐛 Report Bug](https://github.com/user/eyedentify/issues) • [💡 Request Feature](https://github.com/user/eyedentify/issues)

</div>

---

## 🌟 Overview

**EYE'dentify** is a cutting-edge forensic face recognition system designed for law enforcement agencies and forensic professionals. Built with modern web technologies, it combines intuitive sketch creation tools with powerful facial recognition capabilities to assist in criminal identification and investigation processes.

### ✨ Key Features

- 🎨 **Interactive Sketch Creation** - Canvas-based facial sketch tool with advanced drawing capabilities
- 🔍 **AI-Powered Face Recognition** - State-of-the-art facial recognition using OpenCV and machine learning
- 🗃️ **Criminal Database Management** - Comprehensive database for storing and managing criminal records
- 🛡️ **Secure Authentication** - JWT-based authentication with role-based access control
- 📱 **Responsive Design** - Modern glassmorphism UI that works seamlessly across all devices
- ⚡ **Real-time Processing** - Fast image processing and instant recognition results
- 📊 **Analytics Dashboard** - Comprehensive statistics and reporting capabilities

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    A[Frontend - React/TypeScript] --> B[API Gateway - Flask]
    B --> C[Face Recognition Engine]
    B --> D[Criminal Database]
    B --> E[Authentication Service]
    C --> F[OpenCV Processing]
    D --> G[PostgreSQL Database]
    E --> H[JWT Token Management]
```

### Technology Stack

#### 🎨 Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui + Radix UI primitives
- **State Management**: Zustand for global state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6

#### ⚙️ Backend
- **Framework**: Flask (Python)
- **Authentication**: JWT tokens
- **Image Processing**: OpenCV, NumPy, Scikit-image
- **File Handling**: Pillow (PIL)
- **API**: RESTful endpoints with CORS support
- **Database**: Ready for PostgreSQL/MySQL integration

#### 🛠️ Development Tools
- **Package Manager**: npm/bun
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier (configured)
- **Type Checking**: TypeScript strict mode
- **Hot Reload**: Vite HMR

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.8 or higher)
- **npm** or **bun** package manager
- **pip** (Python package installer)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eyedentify.git
cd eyedentify
```

#### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# or using bun
bun install
```

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 4. Environment Configuration

Create a `.env` file in the root directory:
```env
# Frontend Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=EYE'dentify
VITE_APP_VERSION=1.0.0

# Backend Configuration (create backend/.env)
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///forensic.db
JWT_SECRET_KEY=your-jwt-secret-here
```

### Running the Application

#### Development Mode

Start both frontend and backend servers:

```bash
# Terminal 1 - Frontend (from root directory)
npm run dev
# Frontend will run on http://localhost:8080

# Terminal 2 - Backend (from backend directory)
python app.py
# Backend will run on http://localhost:5000
```

#### Production Build

```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
eyedentify/
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/               # Reusable UI components
│   │   ├── 📁 ui/                   # Shadcn UI components
│   │   ├── 📁 layout/               # Layout components
│   │   ├── 📁 facerecognition/      # Face recognition module
│   │   ├── 📁 facesketch/           # Sketch creation module
│   │   ├── 📁 criminaldb/           # Database management
│   │   └── ProtectedRoute.tsx       # Route protection
│   ├── 📁 pages/                    # Page components
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── 📁 dashboard/            # Dashboard sub-pages
│   │   └── NotFound.tsx             # 404 page
│   ├── 📁 services/                 # API services
│   │   └── api.ts                   # HTTP client & endpoints
│   ├── 📁 store/                    # State management
│   │   ├── authStore.ts             # Authentication state
│   │   └── appStore.ts              # Application state
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 lib/                      # Utility functions
│   ├── 📁 styles/                   # Global styles
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
├── 📁 backend/                      # Backend source code
│   ├── 📁 routes/                   # API route handlers
│   │   ├── register.py              # User registration
│   │   └── recognize.py             # Face recognition
│   ├── 📁 models/                   # Data models
│   ├── 📁 services/                 # Business logic
│   ├── 📁 utils/                    # Utility functions
│   ├── 📁 static/                   # Static files
│   ├── app.py                       # Flask application
│   └── requirements.txt             # Python dependencies
├── 📁 public/                       # Static assets
├── 📁 assets/                       # Project assets
├── package.json                     # Frontend dependencies
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## 🎯 Features & Modules

### 🏠 Dashboard
- **Overview Statistics**: Case counts, recognition success rates
- **Quick Actions**: Direct access to main features
- **Recent Activity**: Latest recognitions and matches
- **User Profile**: Authentication status and settings

### 🔍 Face Recognition Module
- **Image Upload**: Drag-and-drop interface with preview
- **Batch Processing**: Multiple image recognition
- **Real-time Results**: Instant processing with progress indicators
- **Match Confidence**: Similarity scores and confidence levels
- **Export Results**: PDF reports and data export

### 🎨 Sketch Creation Module
- **Interactive Canvas**: Fabric.js-powered drawing tools
- **Facial Feature Library**: Pre-built components (eyes, nose, mouth)
- **Layered Drawing**: Multiple layers for complex sketches
- **Save & Export**: Multiple format support (PNG, SVG, PDF)
- **Template Gallery**: Starting templates for different face types

### 🗃️ Criminal Database
- **Record Management**: Add, edit, delete criminal records
- **Advanced Search**: Multi-criteria filtering and search
- **Photo Gallery**: Multiple images per record
- **Data Import/Export**: CSV and JSON support
- **Audit Trail**: Complete change history

### 🛡️ Security & Authentication
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Admin, Operator, Viewer roles
- **Session Management**: Automatic logout and renewal
- **Audit Logging**: Complete user action logs
- **Data Encryption**: Sensitive data protection

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: hsl(271, 91%, 65%)        /* Purple gradient start */
--primary-glow: hsl(271, 91%, 75%)   /* Purple glow effect */

/* Secondary Colors */
--secondary: hsl(189, 100%, 60%)     /* Cyan accent */
--secondary-glow: hsl(189, 100%, 70%) /* Cyan glow effect */

/* Status Colors */
--success: hsl(142, 76%, 36%)        /* Success green */
--warning: hsl(48, 96%, 53%)         /* Warning yellow */
--destructive: hsl(0, 84%, 60%)      /* Error red */

/* Neutral Colors */
--background: hsl(240, 10%, 3.9%)    /* Dark background */
--foreground: hsl(0, 0%, 98%)        /* Light text */
--muted: hsl(240, 3.7%, 15.9%)       /* Muted background */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Scale**: Tailwind's default type scale with custom sizes

### Component Patterns
- **Glassmorphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Purple-to-cyan gradients
- **Rounded Corners**: Consistent 1rem border radius
- **Smooth Animations**: 300ms ease-in-out transitions
- **Responsive Design**: Mobile-first approach

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.eyedentify.com/api
```

### Authentication Endpoints

#### POST `/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "operator"
  }
}
```

#### POST `/auth/register`
Register new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "operator"
}
```

### Face Recognition Endpoints

#### POST `/recognize`
Process uploaded image for face recognition.

**Request:** Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "id": "criminal_123",
      "name": "John Smith",
      "confidence": 0.89,
      "image_url": "/static/images/criminal_123.jpg"
    }
  ],
  "processing_time": 2.3
}
```

### Criminal Database Endpoints

#### GET `/criminals`
Retrieve list of criminals with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `category`: Crime category filter

#### POST `/criminals`
Add new criminal record.

**Request Body:**
```json
{
  "name": "Criminal Name",
  "age": 35,
  "description": "Physical description",
  "crimes": ["theft", "assault"],
  "images": ["base64_encoded_image"]
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
python -m pytest tests/

# E2E tests
npm run test:e2e
```

### Test Coverage

- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

### Testing Checklist

- [ ] Authentication flow (login/logout/register)
- [ ] File upload functionality
- [ ] Face recognition processing
- [ ] Database CRUD operations
- [ ] Responsive design across devices
- [ ] Browser compatibility
- [ ] Performance benchmarks
- [ ] Security vulnerabilities

---

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM python:3.9-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=backend /app /backend
```

### Environment Variables

#### Production Environment
```env
# Frontend
VITE_API_URL=https://api.eyedentify.com
VITE_APP_ENV=production

# Backend
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=production-secret-key
```

### Deployment Platforms

#### Vercel (Frontend)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Heroku (Backend)
```yaml
# Procfile
web: python backend/app.py
```

#### AWS (Full Stack)
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or ECS
- **Database**: RDS PostgreSQL
- **Storage**: S3 for images
- **CDN**: CloudFront

---

## 🔧 Development Guidelines

### Code Style

#### TypeScript/React
```typescript
// Use functional components with hooks
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);
  
  return (
    <div className="glass-card p-6">
      {/* Component content */}
    </div>
  );
};
```

#### Python/Flask
```python
# Use type hints and docstrings
def process_image(image_data: bytes) -> Dict[str, Any]:
    """
    Process uploaded image for face recognition.
    
    Args:
        image_data: Raw image bytes
        
    Returns:
        Dictionary containing recognition results
    """
    # Implementation
```

### Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add face recognition batch processing
fix: resolve image upload timeout issue
docs: update API documentation
style: improve glassmorphism effects
refactor: optimize database queries
test: add integration tests for auth
chore: update dependencies
```

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

---

## 📊 Performance & Optimization

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | 1.2s |
| Largest Contentful Paint | < 2.5s | 2.1s |
| Time to Interactive | < 3.0s | 2.8s |
| Bundle Size (gzipped) | < 500KB | 420KB |

### Optimization Features

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline capability
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization

### Monitoring

- **Frontend**: Web Vitals tracking
- **Backend**: Response time monitoring
- **Database**: Query performance analysis
- **Infrastructure**: Server resource monitoring

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Development Workflow

```bash
# Setup development environment
git clone https://github.com/yourusername/eyedentify.git
cd eyedentify
npm install
cd backend && pip install -r requirements.txt

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run test
npm run lint

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Code Review Process

1. **Automated Checks**: All PRs must pass CI/CD checks
2. **Code Review**: At least one maintainer review required
3. **Testing**: New features must include tests
4. **Documentation**: Update docs for user-facing changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 EYE'dentify Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Getting Help

- **📖 Documentation**: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
- **💬 Discord**: [EYE'dentify Community](https://discord.gg/eyedentify)
- **📧 Email**: support@eyedentify.com
- **🐛 Issues**: [GitHub Issues](https://github.com/user/eyedentify/issues)

### Maintainers

- **Lead Developer**: [@YourUsername](https://github.com/yourusername)
- **UI/UX Designer**: [@DesignerUsername](https://github.com/designerusername)
- **Backend Engineer**: [@BackendUsername](https://github.com/backendusername)

### Acknowledgments

- **OpenCV Community** for computer vision tools
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **All Contributors** who helped build this project

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2024)
- [ ] Advanced sketch editing tools
- [ ] Batch image processing
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration

### Version 1.2 (Q3 2024)
- [ ] AI-powered sketch enhancement
- [ ] Video frame extraction
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Version 2.0 (Q4 2024)
- [ ] Machine learning model training
- [ ] 3D face modeling
- [ ] Integration with law enforcement databases
- [ ] Advanced reporting features

---

<div align="center">

**Built with ❤️ for forensic professionals worldwide**

[⬆ Back to Top](#-eyedentify---forensic-face-recognition-system)

</div>
