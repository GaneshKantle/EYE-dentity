# 🕵️ SketchSight - Forensic Face Sketch & Recognition System

<div align="center">

![SketchSight Logo](https://img.shields.io/badge/SketchSight-Forensic%20AI-blue?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite)
![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=for-the-badge&logo=flask)

**A modern, professional forensic face sketch and recognition system built for law enforcement and forensic professionals**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Development](#-development)
- [📱 User Interface](#-user-interface)
- [🔐 Authentication & Security](#-authentication--security)
- [🌐 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**SketchSight** is a comprehensive forensic face sketch and recognition system designed to assist law enforcement agencies, forensic artists, and investigators in identifying individuals through facial recognition technology. The system combines modern web technologies with advanced computer vision algorithms to provide a professional, secure, and user-friendly platform for forensic investigations.

### 🎯 Key Objectives

- **Digital Sketch Creation**: Provide intuitive tools for creating detailed facial sketches
- **Face Recognition**: Implement AI-powered facial recognition for sketch-to-photo matching
- **Criminal Database Management**: Centralized repository for criminal records and facial data
- **User Authentication**: Secure access control with role-based permissions
- **Modern UI/UX**: Professional interface designed for forensic professionals

### 🎨 Design Philosophy

- **Professional Aesthetic**: Clean, modern interface suitable for law enforcement use
- **Glassmorphism Design**: Contemporary visual elements with translucent surfaces
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant design for inclusive user experience

---

## ✨ Features

### 🔍 Core Functionality

#### 1. **Face Recognition System**
- Upload sketches or photos for AI-powered recognition
- Drag-and-drop file interface with image preview
- Real-time processing with progress indicators
- Match confidence scoring and result display

#### 2. **Digital Sketch Creation**
- Canvas-based sketch creation tools
- Facial feature templates and guides
- Export functionality in multiple formats
- Integration with recognition system

#### 3. **Criminal Database Management**
- Add, edit, and delete criminal records
- Photo and sketch storage
- Advanced search and filtering capabilities
- Data export and reporting tools

#### 4. **User Management System**
- Secure user registration and authentication
- Role-based access control
- User profile management
- Activity logging and audit trails

### 🎨 User Interface Features

- **Modern Dashboard**: Centralized access to all system features
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Theme**: Customizable appearance preferences
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: User feedback and system alerts

---

## 🏗️ Architecture

### 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/TS)    │◄──►│   (Flask/Python)│◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │  Vite   │           │  Flask  │           │  Models │
    │  Build  │           │  CORS   │           │  Schema │
    └─────────┘           └─────────┘           └─────────┘
```

### 🔄 Data Flow

1. **User Authentication**: JWT-based token management
2. **File Upload**: Secure file handling with validation
3. **AI Processing**: Computer vision algorithms for recognition
4. **Result Storage**: Persistent data storage and retrieval
5. **User Feedback**: Real-time updates and notifications

---

## 🛠️ Technology Stack

### 🎨 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework |
| **TypeScript** | 5.8.3 | Type-safe development |
| **Vite** | 5.4.19 | Build tool and dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 12.23.12 | Animation library |
| **Zustand** | 5.0.7 | State management |
| **React Router** | 6.30.1 | Client-side routing |
| **React Hook Form** | 7.61.1 | Form handling |
| **Axios** | 1.11.0 | HTTP client |
| **Shadcn/ui** | Latest | UI component library |

### 🐍 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Flask** | 2.3.3 | Python web framework |
| **Flask-CORS** | 4.0.0 | Cross-origin resource sharing |
| **OpenCV** | 4.8.0 | Computer vision library |
| **NumPy** | 1.24.0 | Numerical computing |
| **SciPy** | 1.11.0 | Scientific computing |
| **Pillow** | 10.0.0 | Image processing |
| **JWT** | Latest | Authentication tokens |

### 🗄️ Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and formatting |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |
| **Vite** | Development server and build |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixing |

---

## 📁 Project Structure

```
sketchsight/
├── 📁 frontend/                    # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   ├── 📁 ui/              # Shadcn/ui components
│   │   │   ├── 📁 facerecognition/ # Face recognition components
│   │   │   ├── 📁 facesketch/      # Sketch creation components
│   │   │   └── 📁 criminaldb/      # Database management components
│   │   ├── 📁 pages/               # Application pages
│   │   │   ├── 📁 dashboard/       # Dashboard pages
│   │   │   └── Dashboard.tsx       # Main dashboard
│   │   ├── 📁 store/               # State management
│   │   │   ├── authStore.ts        # Authentication state
│   │   │   └── appStore.ts         # Application state
│   │   ├── 📁 services/            # API services
│   │   │   └── api.ts              # API client configuration
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 lib/                 # Utility functions
│   │   ├── 📁 styles/              # Global styles
│   │   ├── App.tsx                 # Main application component
│   │   └── main.tsx                # Application entry point
│   ├── 📁 public/                  # Static assets
│   ├── 📁 assets/                  # Application assets
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.ts              # Vite configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   └── tsconfig.json               # TypeScript configuration
├── 📁 backend/                     # Flask backend application
│   ├── 📁 routes/                  # API route handlers
│   │   ├── register.py             # User registration routes
│   │   └── recognize.py            # Face recognition routes
│   ├── 📁 models/                  # Data models
│   ├── 📁 services/                # Business logic services
│   ├── 📁 utils/                   # Utility functions
│   ├── 📁 static/                  # Static files
│   ├── app.py                      # Main Flask application
│   └── requirements.txt            # Python dependencies
├── 📁 docs/                        # Documentation
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **Bun** (v1.0.0 or higher)
- **Python** (v3.8.0 or higher)
- **pip** (Python package manager)
- **Git** (for version control)

### 🔧 Installation

#### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/sketchsight.git
cd sketchsight
```

#### 2. **Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
bun install

# Create environment file
cp .env.example .env.local
```

#### 3. **Backend Setup**

```bash
# Navigate to backend directory
cd ../backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 4. **Environment Configuration**

Create a `.env.local` file in the frontend directory:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SketchSight
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### 🚀 Running the Application

#### **Development Mode**

1. **Start Backend Server**
```bash
cd backend
python app.py
```
The Flask server will start on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
# or
bun dev
```
The React app will start on `http://localhost:8080`

#### **Production Build**

```bash
# Build frontend for production
cd frontend
npm run build

# The built files will be in the `dist/` directory
```

---

## 🔧 Development

### 🏗️ Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature with tests
   - Submit pull request for review

2. **Code Quality**
   - Follow TypeScript best practices
   - Use ESLint for code linting
   - Maintain consistent code formatting

3. **Testing Strategy**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - End-to-end tests for critical user flows

### 📝 Code Style Guidelines

#### **TypeScript/React**
```typescript
// Use functional components with hooks
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initialState);
  
  // Use meaningful variable names
  const handleUserAction = useCallback(() => {
    // Implementation
  }, []);
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};
```

#### **Python/Flask**
```python
# Use descriptive function names
@app.route('/api/users', methods=['GET'])
def get_users():
    """Retrieve all users from the database."""
    try:
        users = User.query.all()
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

### 🔍 Debugging

#### **Frontend Debugging**
- Use React Developer Tools
- Browser console logging
- Vite dev server hot reload

#### **Backend Debugging**
- Flask debug mode
- Python logging
- Postman/Insomnia for API testing

---

## 📱 User Interface

### 🎨 Design System

#### **Color Palette**
```css
/* Primary Colors */
--primary: hsl(271 91% 65%);      /* Purple */
--secondary: hsl(189 100% 60%);   /* Cyan */
--success: hsl(142 76% 36%);      /* Green */
--warning: hsl(38 92% 50%);       /* Orange */
--error: hsl(0 84% 60%);          /* Red */

/* Neutral Colors */
--background: hsl(240 10% 3.9%);  /* Dark */
--foreground: hsl(0 0% 98%);      /* Light */
--muted: hsl(240 4.8% 95.9%);    /* Gray */
```

#### **Typography**
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### **Spacing System**
```css
/* Spacing Scale */
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### 📱 Responsive Design

#### **Breakpoints**
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

#### **Layout Components**
- **Grid System**: CSS Grid for complex layouts
- **Flexbox**: Flexbox for component alignment
- **Container**: Responsive container with max-width
- **Spacing**: Consistent spacing using Tailwind utilities

---

## 🔐 Authentication & Security

### 🔑 Authentication Flow

1. **User Registration**
   - Email and password validation
   - Username uniqueness check
   - Password strength requirements

2. **User Login**
   - Credential verification
   - JWT token generation
   - Session management

3. **Token Management**
   - Access token storage
   - Token refresh mechanism
   - Automatic logout on expiration

### 🛡️ Security Features

#### **Frontend Security**
- Input validation and sanitization
- XSS protection
- CSRF token implementation
- Secure HTTP headers

#### **Backend Security**
- JWT token validation
- Rate limiting
- Input sanitization
- SQL injection prevention

#### **Data Protection**
- Encrypted data transmission (HTTPS)
- Secure file upload validation
- User data privacy controls
- Audit logging

---

## 🌐 API Reference

### 🔐 Authentication Endpoints

#### **POST /api/auth/register**
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "string"
    },
    "token": "string"
  }
}
```

#### **POST /api/auth/login**
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "string"
  }
}
```

### 🔍 Face Recognition Endpoints

#### **POST /api/recognize**
Upload image for face recognition.

**Request:**
- `Content-Type: multipart/form-data`
- `image`: Image file (JPG, PNG, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "string",
        "confidence": 0.95,
        "criminal": {
          "name": "string",
          "photo": "string"
        }
      }
    ],
    "processingTime": "1.2s"
  }
}
```

### 🗄️ Criminal Database Endpoints

#### **GET /api/criminals**
Retrieve criminal records with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Criminal category filter

#### **POST /api/criminals**
Add new criminal record.

**Request Body:**
```json
{
  "name": "string",
  "age": "number",
  "category": "string",
  "description": "string",
  "photo": "file"
}
```

### 👤 User Profile Endpoints

#### **GET /api/user/profile**
Retrieve current user profile.

**Headers:**
- `Authorization: Bearer <token>`

#### **PUT /api/user/profile**
Update user profile information.

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

---

## 🧪 Testing

### 🧪 Testing Strategy

#### **Frontend Testing**
- **Unit Tests**: Component testing with Jest and React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing with Playwright

#### **Backend Testing**
- **Unit Tests**: Function and class testing with pytest
- **API Tests**: Endpoint testing with pytest-flask
- **Integration Tests**: Database and service testing

### 📋 Test Coverage Goals

- **Frontend**: >80% component coverage
- **Backend**: >85% function coverage
- **API**: 100% endpoint coverage
- **Critical Paths**: 100% user flow coverage

### 🚀 Running Tests

#### **Frontend Tests**
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### **Backend Tests**
```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run all tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

---

## 📦 Deployment

### 🚀 Production Deployment

#### **Frontend Deployment**

1. **Build Application**
```bash
cd frontend
npm run build
```

2. **Deploy to Hosting Service**
   - **Vercel**: Automatic deployment from Git
   - **Netlify**: Drag and drop deployment
   - **AWS S3**: Static website hosting
   - **Nginx**: Self-hosted deployment

#### **Backend Deployment**

1. **Prepare Production Environment**
```bash
cd backend

# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export FLASK_DEBUG=false
```

2. **Deploy to Cloud Platform**
   - **Heroku**: Git-based deployment
   - **AWS EC2**: Virtual machine deployment
   - **Google Cloud**: App Engine deployment
   - **Docker**: Containerized deployment

### 🐳 Docker Deployment

#### **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Backend Dockerfile**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/sketchsight
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=sketchsight
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 🔧 Environment Configuration

#### **Production Environment Variables**
```env
# Frontend
VITE_API_URL=https://api.sketchsight.com
VITE_APP_NAME=SketchSight
VITE_APP_VERSION=1.0.0

# Backend
FLASK_ENV=production
FLASK_DEBUG=false
DATABASE_URL=postgresql://user:pass@localhost:5432/sketchsight
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://sketchsight.com
```

---

## 🤝 Contributing

### 📋 Contribution Guidelines

We welcome contributions from the community! Please follow these guidelines:

#### **Code of Conduct**
- Be respectful and inclusive
- Follow professional communication standards
- Report inappropriate behavior

#### **Development Process**
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Test** thoroughly
5. **Submit** a pull request

#### **Code Standards**
- Follow existing code style
- Write clear commit messages
- Include tests for new features
- Update documentation as needed

### 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, version information
- **Screenshots**: Visual evidence if applicable

### 💡 Feature Requests

For feature requests, please provide:

- **Description**: Clear description of the feature
- **Use Case**: How it would benefit users
- **Implementation Ideas**: Suggestions for implementation
- **Mockups**: Visual designs if applicable

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📜 License Summary

- **Commercial Use**: ✅ Allowed
- **Modification**: ✅ Allowed
- **Distribution**: ✅ Allowed
- **Private Use**: ✅ Allowed
- **Liability**: ❌ Limited
- **Warranty**: ❌ None

---

## 🙏 Acknowledgments

### 🏢 Organizations
- **Law Enforcement Agencies**: For domain expertise and feedback
- **Forensic Artists**: For professional insights and requirements
- **Open Source Community**: For the amazing tools and libraries

### 🛠️ Technologies
- **React Team**: For the amazing frontend framework
- **Vite Team**: For the fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Flask Team**: For the Python web framework

### 👥 Contributors

Thanks to all contributors who have helped make SketchSight better:

- **Core Team**: Development and design
- **Beta Testers**: Feedback and bug reports
- **Documentation**: Help with documentation
- **Community**: Ideas and suggestions

---

## 📞 Support & Contact

### 🆘 Getting Help

- **Documentation**: [docs.sketchsight.com](#)
- **Issues**: [GitHub Issues](https://github.com/yourusername/sketchsight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sketchsight/discussions)
- **Email**: support@sketchsight.com

### 🔗 Links

- **Website**: [sketchsight.com](#)
- **Documentation**: [docs.sketchsight.com](#)
- **API Reference**: [api.sketchsight.com](#)
- **Status Page**: [status.sketchsight.com](#)

### 📱 Social Media

- **Twitter**: [@SketchSight](https://twitter.com/sketchsight)
- **LinkedIn**: [SketchSight](https://linkedin.com/company/sketchsight)
- **YouTube**: [SketchSight Channel](https://youtube.com/sketchsight)

---

<div align="center">

**Made with ❤️ for the forensic community**

*SketchSight - Empowering investigators with AI-powered facial recognition*

[⬆️ Back to Top](#-sketchsight---forensic-face-sketch--recognition-system)

</div>
