# MediCare - Medication Management App

A comprehensive medication tracking application built with React, TypeScript, and Supabase. Designed for both patients and caretakers to manage and monitor medication adherence.

## 🚀 Features

### Core Features
- **Dual Role System**: Switch between Patient and Caretaker views
- **Secure Authentication**: Email/password authentication with Supabase
- **Medication Management**: Add, edit, and delete medications
- **Adherence Tracking**: Mark medications as taken and track compliance
- **Real-time Updates**: Optimistic UI updates with React Query
- **Responsive Design**: Mobile-first design that works on all devices

### Patient Features
- Personal medication dashboard
- Daily medication tracking
- Adherence statistics and insights
- Streak tracking for motivation
- Visual progress indicators

### Caretaker Features
- Monitor patient medication adherence
- View comprehensive adherence reports
- Real-time status updates
- Alert system for missed medications
- Historical data analysis

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medicare-app
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the migration file in your Supabase SQL editor:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute in Supabase SQL Editor

### 4. Development

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
```

## 🗄️ Database Schema

### Tables

- **profiles**: User profiles with role information
- **medications**: Medication details (name, dosage, frequency)
- **medication_logs**: Tracking when medications are taken

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper authentication checks on all operations

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Features in Detail

### Authentication
- Secure email/password authentication
- Form validation with helpful error messages
- Password visibility toggle
- Automatic session management

### Medication Management
- Add medications with name, dosage, and frequency
- Edit existing medications
- Delete medications with confirmation
- Input validation and error handling

### Adherence Tracking
- Mark medications as taken for the current day
- Visual indicators for completion status
- Prevent duplicate entries for the same day
- Optimistic UI updates for better UX

### Dashboard Analytics
- 30-day adherence percentage
- Current streak tracking
- Daily progress indicators
- Visual progress bars and charts

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for both desktop and mobile

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Input validation and sanitization
- XSS protection headers
- Secure authentication flow
- Environment variable protection

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📊 Performance Optimizations

- React Query for efficient data caching
- Optimistic updates for better UX
- Lazy loading and code splitting
- Efficient re-rendering with proper dependencies
- Image optimization and compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added caretaker dashboard and role switching
- **v1.2.0**: Enhanced UI/UX and mobile responsiveness
- **v1.3.0**: Performance optimizations and bug fixes

---

Made with ❤️ for better medication management