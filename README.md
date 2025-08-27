# GitAlong Website

A modern, responsive website for GitAlong - the platform that helps developers find their perfect coding partners.

## Features

### ✅ Functional Authentication
- **Firebase Authentication** - Complete login/signup system
- **GitHub OAuth** - Sign in with GitHub account
- **Google OAuth** - Sign in with Google account
- **Email/Password** - Traditional authentication
- **User Profile Management** - View and manage user profiles

### ✅ Real GitHub Integration
- **GitHub API Integration** - Real GitHub data instead of mock data
- **Profile Details** - Complete GitHub profile information
- **Authentication** - GitHub OAuth integration

### ✅ Functional Navigation
- **User Menu** - Functional profile and settings options
- **Responsive Navigation** - Works on desktop and mobile
- **Clean Navigation** - Simple navigation focused on core pages

### ✅ Interactive Components
- **Get Started Button** - Navigates to search or triggers signup
- **Learn More Button** - Smooth scroll to features section
- **Download App Buttons** - Platform-specific app store links
- **GitHub Login** - Functional GitHub authentication in maintainer portal

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# GitHub OAuth
VITE_GITHUB_CLIENT_ID=your_github_client_id

# GitHub API Token (for accessing GitHub API)
VITE_GITHUB_TOKEN=your_github_token

# App Configuration
VITE_APP_NAME=GitAlong
VITE_APP_DESCRIPTION=Find your perfect coding partner
VITE_APP_URL=https://gitalong.vercel.app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Key Improvements Made

### Authentication System
- ✅ Firebase authentication fully configured
- ✅ GitHub OAuth integration working
- ✅ User state management implemented
- ✅ Protected routes for authenticated users

### GitHub Integration
- ✅ Removed all mock data
- ✅ Real GitHub API calls implemented  
- ✅ Authentication with GitHub OAuth
- ✅ Error handling for missing GitHub token

### Navigation & Routing
- ✅ Navigation system simplified and functional
- ✅ User menu with working profile/settings
- ✅ Clean navigation focused on core features
- ✅ Mobile-responsive navigation

### Button Functionality
- ✅ Get Started button navigates to about page or triggers signup
- ✅ Learn More button scrolls to features section
- ✅ Download App buttons link to app stores
- ✅ GitHub login button functional in maintainer portal
- ✅ Profile and Settings buttons in user menu

### Error Handling
- ✅ Graceful handling of missing GitHub token
- ✅ Firebase availability checks
- ✅ User-friendly error messages
- ✅ Loading states for API calls

## Pages & Routes

- `/` - Landing page with hero section and features
- `/about` - About page with project story
- `/contact` - Contact page with form
- `/privacy` - Privacy policy page
- `/maintainer` - Maintainer portal with GitHub login

## Technologies Used

- **React 18** with TypeScript
- **Vite** for build tooling
- **Firebase** for authentication and backend
- **GitHub API** for developer data
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

## Development Notes

- All buttons are now functional and provide meaningful interactions
- No mock data remains - all data comes from real APIs
- GitHub authentication is properly configured
- User experience is smooth with proper loading states
- Error handling is comprehensive and user-friendly

## Next Steps

1. **Add GitHub Token** - Get a GitHub personal access token and add it to `.env`
2. **Configure Firebase** - Set up Firebase project and add credentials
3. **Test Authentication** - Try signing up and logging in
4. **Test Search** - Search for developers and view their profiles
5. **Deploy** - Deploy to Vercel or your preferred platform

## 🚀 Features

- **Modern Design**: Beautiful, responsive design with smooth animations
- **Authentication**: Firebase-powered sign in/sign up with Google and GitHub
- **Real-time**: Live updates and notifications
- **Mobile-First**: Optimized for all devices
- **Performance**: Fast loading with optimized builds

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Deployment**: Vercel
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the Vite configuration

2. **Set Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all Firebase environment variables from `.env.example`

3. **Deploy**
   - Vercel will automatically build and deploy on every push to main branch

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── lib/           # Utility libraries
│   └── assets/        # Static assets
├── public/            # Public assets
├── dist/              # Build output
└── vercel.json        # Vercel configuration
```

## 🔒 Environment Variables

Make sure to set these environment variables in your Vercel deployment:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 🎨 Customization

### Colors
The website uses a GitHub-inspired dark theme with green accents. Colors are defined in Tailwind CSS classes throughout the components.

### Animations
Animations are powered by Framer Motion. You can customize animations in the component files.

### Content
Update content in the component files:
- `HeroSection.tsx` - Main hero content
- `FeaturesSection.tsx` - Feature descriptions
- `TestimonialsSection.tsx` - User testimonials
- `AboutPage.tsx` - About page content

## 📱 Performance

- **Code Splitting**: Automatic code splitting with Vite
- **Image Optimization**: Optimized images and assets
- **Caching**: Proper cache headers for static assets
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔍 SEO

- Meta tags are configured in `index.html`
- Open Graph tags for social sharing
- Proper title and description tags

## 🐛 Troubleshooting

### Build Issues
- Ensure all environment variables are set
- Check that all dependencies are installed
- Verify TypeScript compilation

### Deployment Issues
- Check Vercel build logs
- Verify environment variables in Vercel dashboard
- Ensure `vercel.json` is properly configured

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ by developers, for developers. 