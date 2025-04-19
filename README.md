# DeepFake Detection Research Lab Website

A modern, visually engaging website for a research team specializing in Deep Fake detection and analysis. The website features a dark-themed aesthetic with futuristic and AI-inspired design elements.

## Features

- **Responsive Design**: Fully responsive across all devices
- **Dark Theme**: Deep blue and black background with accents of cyan, neon purple, and white text
- **Interactive Elements**: Smooth scrolling, parallax effects, hover animations, and dynamic counters
- **Modern UI Components**: 
  - Hero section with animated particles
  - Research projects showcase
  - Team member profiles
  - Case studies section
  - Blog/news section
  - Interactive demo section
  - Contact form
- **Research Platform**:
  - Paper repository with search and filtering
  - Dataset management
  - Experiment tracking
  - Team contributions and leaderboard
  - File upload and storage system

## Tech Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Storage**: Firebase Storage
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- MongoDB database (Atlas or local)
- Firebase project with Storage enabled
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deepfake-detection-website.git
cd deepfake-detection-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required environment variables

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions
│   │   ├── firebase.ts # Firebase configuration
│   │   ├── mongodb.ts  # MongoDB configuration
│   │   ├── mongoose.ts # Mongoose configuration
│   │   └── storage.ts  # Storage utilities
│   └── models/         # Mongoose models
├── middleware.ts       # Next.js middleware
├── package.json
└── README.md
```

## Database Schema

### Users
- Name, email, role, profile image
- Contributions (papers, datasets, experiments)
- Specialization and bio

### Papers
- Title, authors, abstract, tags
- File URL, thumbnail
- Citations, downloads, views
- Bookmarks

### Datasets
- Name, description, category, tags
- File URL, size, format
- Uploaded by, download count

### Experiments
- Name, description, status, progress
- Datasets used, model type, parameters
- Results (accuracy, precision, recall)
- Logs and output files

## Storage Structure

Files are stored in Firebase Storage with the following structure:
- `/papers/{userId}/{filename}` - Research papers
- `/datasets/{userId}/{filename}` - Datasets
- `/experiments/{userId}/{filename}` - Experiment outputs
- `/images/{userId}/{filename}` - Images and thumbnails

## Authentication

The application uses NextAuth.js for authentication with two providers:
- Google OAuth for social login
- Credentials provider for email/password login

## Deployment

This website can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdeepfake-detection-website)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [NextAuth.js](https://next-auth.js.org/)
