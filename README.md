# EYE'dentify - Forensic Face Sketch & Recognition System

<div align="center">
  <img src="/assets/logo.png" alt="EYE'dentify Logo" width="200"/>
  
  **A Modern Forensic Face Recognition and Sketch Creation Platform**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue?logo=tailwindcss)](https://tailwindcss.com/)
  [![Flask](https://img.shields.io/badge/Flask-Latest-black?logo=flask)](https://flask.palletsprojects.com/)
  
  [Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)
</div>

---

## 🌟 Overview

**EYE'dentify** is a cutting-edge forensic face recognition system designed to assist law enforcement agencies in identifying suspects through advanced facial recognition technology and sketch creation capabilities. Built with modern web technologies, it offers a sleek, intuitive interface combined with powerful backend processing.

### 🎯 Key Features

- **🎨 Face Sketch Creation**: Interactive canvas-based sketch creation tool with facial feature libraries
- **🔍 Face Recognition**: Advanced AI-powered face matching against criminal databases
- **📊 Criminal Database Management**: Comprehensive database with search, filter, and CRUD operations
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Mobile-first design with glassmorphism and modern UI patterns
- **⚡ Real-time Processing**: Fast image processing and recognition results
- **📈 Analytics Dashboard**: Visual insights and statistics on recognition patterns

## 🏗️ Architecture

### Technology Stack

<table>
<tr>
<td align="center" width="50%">

**Frontend**

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **Shadcn/UI** - Component Library
- **Zustand** - State Management
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Fabric.js** - Canvas Drawing
- **React Hook Form** - Form Management
- **Axios** - HTTP Client

</td>
<td align="center" width="50%">

**Backend**

- **Flask** - Python Web Framework
- **Flask-CORS** - Cross-Origin Support
- **OpenCV** - Image Processing
- **NumPy** - Numerical Computing
- **scikit-image** - Image Analysis
- **Pillow** - Image Manipulation
- **JWT** - Authentication
- **SQLAlchemy** - ORM (planned)
- **PostgreSQL** - Database (planned)

</td>
</tr>
</table>

### System Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend] --> B[API Service Layer]
        B --> C[State Management]
        C --> D[UI Components]
    end
    
    subgraph "Server Side"
        E[Flask API] --> F[Authentication]
        E --> G[Recognition Service]
        E --> H[Database Service]
        G --> I[OpenCV Processing]
        H --> J[Criminal Database]
    end
    
    B -.-> E
    D -.-> A
```

## 📁 Project Structure

```
eye-dentify/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── layout/              # Layout components
│   │   ├── facerecognition/     # Face recognition module
│   │   ├── facesketch/          # Sketch creation module
│   │   └── criminaldb/          # Database management
│   ├── pages/                   # Page components
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Index.tsx           # Landing page
│   │   └── NotFound.tsx        # 404 page
│   ├── services/               # API integration
│   ├── store/                  # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── styles/                 # Global styles
├── backend/                    # Backend source code
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── models/                 # Data models
│   ├── utils/                  # Utility functions
│   └── static/                 # Static files
├── public/                     # Public assets
├── assets/                     # Project assets
└── config files...            # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.8+ recommended)
- **npm** or **bun** package manager
- **Git** for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eye-dentify.git
cd eye-dentify
```

#### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install
# or using bun
bun install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

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

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

The backend API will be available at `http://localhost:5000`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000

# Backend (create .env in backend directory)
FLASK_SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost/eyedentify
```

## 📖 Documentation

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{username, email, password}` |
| POST | `/api/auth/login` | User login | `{email, password}` |
| POST | `/api/auth/logout` | User logout | - |
| GET | `/api/auth/verify` | Verify JWT token | - |

#### Face Recognition

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/recognize` | Process face recognition | `FormData with image` |
| GET | `/api/recognize/history` | Get recognition history | - |
| GET | `/api/recognize/:id` | Get specific result | - |

#### Criminal Database

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/criminals` | List all criminals | Query params for filters |
| POST | `/api/criminals` | Add new criminal | Criminal data + image |
| GET | `/api/criminals/:id` | Get criminal details | - |
| PUT | `/api/criminals/:id` | Update criminal info | Updated data |
| DELETE | `/api/criminals/:id` | Delete criminal record | - |

#### Sketch Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/sketches` | Save new sketch | Sketch data |
| GET | `/api/sketches` | Get user sketches | - |
| POST | `/api/sketches/recognize` | Recognize from sketch | Sketch data |

### Frontend Routes

| Route | Component | Description | Protected |
|-------|-----------|-------------|-----------|
| `/` | Redirect to Dashboard | Landing page | No |
| `/login` | Login | User authentication | No |
| `/register` | Register | User registration | No |
| `/dashboard` | Dashboard | Main dashboard | Yes |
| `/face-recognition` | FaceRecognition | Upload and recognize faces | Yes |
| `/make-sketch` | FaceSketch | Create facial sketches | Yes |
| `/criminal-database` | CriminalDatabase | Manage criminal records | Yes |
| `/match-found` | MatchFound | Recognition success page | Yes |
| `/match-not-found` | MatchNotFound | Recognition failure page | Yes |
| `/profile` | Profile | User profile management | Yes |
| `/settings` | Settings | Application settings | Yes |

## 🎨 Design System

### Color Palette

| Color | HSL Value | Usage |
|-------|-----------|--------|
| Primary | `hsl(271 91% 65%)` | Buttons, links, accents |
| Secondary | `hsl(189 100% 60%)` | Secondary actions |
| Success | `hsl(142 76% 36%)` | Success states |
| Background | `hsl(240 10% 3.9%)` | Dark background |
| Glass | `rgba(255,255,255,0.1)` | Glassmorphism effects |

### UI Components

The project uses **Shadcn/UI** components with custom styling:

- **Glass Cards**: Translucent cards with backdrop blur
- **Gradient Buttons**: Purple to cyan gradient effects
- **Custom Inputs**: Styled form inputs with focus states
- **Animated Elements**: Smooth transitions and hover effects

## 🛠️ Development

### Running Tests

```bash
# Frontend tests (when implemented)
npm run test

# Backend tests
cd backend
python -m pytest
```

### Building for Production

```bash
# Frontend build
npm run build

# Preview production build
npm run preview
```

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 compliance with Black formatter

```bash
# Frontend linting
npm run lint

# Backend formatting
black backend/
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend Deployment (Heroku/Railway)

1. Create `Procfile`: `web: gunicorn app:app`
2. Set environment variables
3. Deploy via Git push

### Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🔧 Troubleshooting

### Common Issues

<details>
<summary>CORS errors when connecting to backend</summary>

Ensure Flask-CORS is properly configured:
```python
CORS(app, origins=["http://localhost:8080"])
```
</details>

<details>
<summary>Image upload fails</summary>

Check file size limits and supported formats:
```python
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
```
</details>

<details>
<summary>Authentication issues</summary>

Verify JWT token is being sent in headers:
```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```
</details>

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Shadcn/UI for the component library
- OpenCV community for image processing tools
- Flask team for the excellent web framework
- All contributors who help improve this project

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/eye-dentify/issues)
- **Email**: support@eyedentify.com
- **Documentation**: [Full documentation](https://docs.eyedentify.com)

---

<div align="center">
  Built with ❤️ for law enforcement professionals
  
  <sub>Making the world safer, one face at a time</sub>
</div>
