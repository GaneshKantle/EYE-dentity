# SketchSight - Forensic Face Sketch & Recognition System

## 🚀 Project Overview

SketchSight is a modern, professional forensic face sketch and recognition system built with React, TypeScript, and Tailwind CSS. The application features a sleek Gen Z-inspired design with glassmorphism effects, gradient backgrounds, and smooth animations.

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Zustand** for state management
- **React Hook Form** for form handling
- **Axios** for API communication
- **React Dropzone** for file uploads
- **Fabric.js** for sketch creation
- **Lucide React** for icons
- **Shadcn/ui** for UI components

### Backend (Integration Ready)
- **Flask** (Python) REST API
- **JWT** authentication
- **File upload** handling
- **Database** integration

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (`hsl(271 91% 65%)`)
- **Secondary**: Cyan (`hsl(189 100% 60%)`)
- **Success**: Green (`hsl(142 76% 36%)`)
- **Background**: Dark (`hsl(240 10% 3.9%)`)
- **Glass**: Translucent surfaces with backdrop blur

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Design Principles
- **Glassmorphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Purple to cyan gradients
- **Rounded Corners**: 1rem border radius
- **Smooth Animations**: 300ms transitions
- **Mobile-First**: Responsive design

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx           # Main navigation
│   ├── ui/                      # Shadcn UI components
│   └── ProtectedRoute.tsx       # Auth route protection
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── FaceRecognition.tsx     # Face recognition upload
│   ├── MakeSketch.tsx          # Sketch creation (TODO)
│   ├── CriminalDatabase.tsx    # Database management (TODO)
│   ├── MatchFound.tsx          # Recognition success (TODO)
│   ├── MatchNotFound.tsx       # Recognition failure (TODO)
│   ├── Profile.tsx             # User profile (TODO)
│   └── Settings.tsx            # App settings (TODO)
├── services/
│   └── api.ts                  # API service layer
├── store/
│   ├── authStore.ts            # Authentication state
│   └── appStore.ts             # Application state
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
└── styles/
    └── index.css               # Global styles & design system
```

## 🔐 Authentication Flow

### JWT Token Management
- Tokens stored in `localStorage`
- Automatic token attachment to API requests
- Auto-redirect to login on 401 responses
- Persistent auth state with Zustand

### Protected Routes
- All main features require authentication
- Redirect to login with return path
- Loading states during auth checks

## 🎯 Feature Modules

### 1. Dashboard
- **Path**: `/dashboard`
- **Features**: 
  - Welcome message with username
  - Three main feature cards (clickable)
  - Stats display
  - Responsive grid layout

### 2. Face Recognition
- **Path**: `/face-recognition`
- **Features**:
  - Drag & drop file upload
  - Image preview
  - Recognition processing
  - Result navigation

### 3. Make Sketch (TODO)
- **Path**: `/make-sketch`
- **Features**:
  - Canvas-based sketch creation
  - Facial feature selection
  - Save/export functionality
  - Integration with recognition

### 4. Criminal Database (TODO)
- **Path**: `/criminal-database`
- **Features**:
  - Add new criminal records
  - Search and filter
  - Photo upload
  - Data management

## 🌐 API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'http://localhost:5000';
```

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Face Recognition Endpoints
- `POST /api/recognize` - Face recognition
- `POST /api/save-sketch` - Save sketch data

### Criminal Database Endpoints
- `POST /api/criminals/add` - Add criminal
- `GET /api/criminals/list` - List criminals
- `DELETE /api/criminals/:id` - Delete criminal

### User Management Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## 🎨 Custom CSS Classes

### Component Classes
```css
.glass-card              # Glassmorphism card
.feature-card            # Dashboard feature cards
.auth-container          # Authentication page wrapper
.auth-card               # Authentication form card
```

### Button Variants
```css
.btn-primary             # Primary gradient button
.btn-secondary           # Secondary button
.btn-ghost               # Ghost/outline button
```

### Input Styling
```css
.input-field             # Form input styling
```

### Utilities
```css
.gradient-text           # Gradient text effect
.animate-float           # Floating animation
.animate-glow            # Glow animation
.transition-smooth       # Smooth transitions
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible navigation
- Stacked layouts
- Touch-friendly buttons
- Optimized animations

## 🔧 Development

### Setup
```bash
npm install
npm run dev
```

### Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

### Build
```bash
npm run build
```

## 🚀 Deployment Ready

The application is configured for production deployment with:
- Optimized Vite build
- Code splitting
- Asset optimization
- Environment variable support

## 🎯 Next Steps

### High Priority
1. Complete sketch creation module
2. Implement criminal database
3. Add match result pages
4. Error handling improvements

### Medium Priority
1. User profile management
2. Settings page
3. Advanced search filters
4. Batch processing

### Future Enhancements
1. Real-time collaboration
2. AI-powered sketch assistance
3. Mobile app version
4. Advanced analytics

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow
- [ ] Responsive design
- [ ] File upload functionality
- [ ] Navigation between pages
- [ ] Error handling
- [ ] Loading states

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance

### Optimization Features
- Lazy loading components
- Image optimization
- Code splitting
- Efficient state management
- Minimal bundle size

### Metrics Goals
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Bundle size < 500KB gzipped

---

*Built with ❤️ for forensic professionals*