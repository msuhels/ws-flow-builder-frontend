# Trae Project - Frontend

Modern React + TypeScript + Vite frontend application with Tailwind CSS.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # React components
│   │   ├── flow/        # Flow builder components
│   │   └── ui/          # Reusable UI components
│   ├── config/          # Configuration files
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # State management (Zustand)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Flow Builder**: XYFlow React
- **Icons**: Lucide React
- **Database**: Supabase

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on port 3000

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173` with hot module replacement.

API requests to `/api/*` are proxied to `http://localhost:3000`.

## Production

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run check` - Type check without emitting files

## Features

### Authentication
- Login/Register with JWT
- Protected routes
- Automatic token refresh
- Session persistence

### Dashboard
- Overview statistics
- Recent activity
- Quick actions

### Flow Builder
- Visual flow editor
- Drag and drop nodes
- Multiple node types:
  - Start Node
  - Message Node
  - Input Node
  - Condition Node
  - Webhook Node
  - Agent Handoff Node
  - Tag Node
  - Note Node
- Real-time flow testing
- Properties panel

### Contacts Management
- Contact list
- Contact details
- Add/Edit/Delete contacts
- Contact tagging

### Settings
- Webhook configuration
- API key management
- Notification preferences

## Project Architecture

### Components
- **UI Components**: Reusable components in `components/ui/`
- **Feature Components**: Feature-specific components
- **Layout Components**: Layout wrappers and navigation

### State Management
- **Zustand**: Lightweight state management
- **Auth Store**: User authentication state
- **Local Storage**: Persistent storage for auth tokens

### API Layer
- **Axios Instance**: Configured HTTP client with interceptors
- **API Services**: Organized by feature (auth, flows, contacts, etc.)
- **Type Safety**: Full TypeScript support

### Routing
- **React Router**: Client-side routing
- **Protected Routes**: Authentication-based route guards
- **Nested Routes**: Layout-based route nesting

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Styled with Tailwind utilities
- **Dark Mode**: Theme support (via useTheme hook)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | No (default: /api) |
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |

## Code Organization

### Types
All TypeScript types are centralized in `src/types/index.ts` for consistency.

### Constants
Application constants are in `src/constants/index.ts` to avoid magic strings.

### Services
API calls are organized by feature in `src/services/` for maintainability.

### Utilities
Helper functions are in `src/lib/` for reusability.

## Best Practices

- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components small and focused
- Use custom hooks for reusable logic
- Centralize API calls in services
- Use constants instead of magic strings
- Implement proper error handling
- Add loading states for async operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

