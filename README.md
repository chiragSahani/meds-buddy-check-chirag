# MediCare - Medication Management App

A comprehensive medication tracking web application built with React, TypeScript, and Supabase. The app supports dual roles (Patient and Caretaker) for managing and monitoring medication schedules with real-time adherence tracking.

## 🚀 Live Demo

[View Live Demo](https://meds-buddy-check.lovable.app/)

## ✨ Features

### Phase 1 (Core Features)
- ✅ **Supabase Authentication** - Email/password signup and login
- ✅ **Role-based Dashboards** - Separate views for patients and caretakers
- ✅ **Medication Management** - Add, view, and delete medications
- ✅ **Daily Tracking** - Mark medications as taken for the day
- ✅ **Adherence Statistics** - Real-time calculation of adherence percentages and streaks
- ✅ **Optimistic Updates** - Instant UI feedback using React Query

### Phase 2 (Enhanced Features)
- ✅ **Real-time Monitoring** - Caretakers can monitor patient medication status
- ✅ **Adherence Analytics** - Visual progress tracking and statistics
- ✅ **Role Switching** - Easy switching between patient and caretaker views

### Phase 3 (Bonus Features)
- 🔄 **File Uploads** - Medication proof photos (Supabase Storage integration)
- 🔄 **Deployment** - Production deployment to Vercel/Netlify

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI + Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Testing**: Vitest + Testing Library
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medicare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     role TEXT CHECK (role IN ('patient', 'caretaker')) NOT NULL,
     full_name TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create medications table
   CREATE TABLE medications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     dosage TEXT NOT NULL,
     frequency TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create medication_logs table
   CREATE TABLE medication_logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     taken_at TIMESTAMPTZ DEFAULT NOW(),
     notes TEXT,
     photo_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own medications" ON medications
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own medications" ON medications
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own medications" ON medications
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own medications" ON medications
     FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own medication logs" ON medication_logs
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own medication logs" ON medication_logs
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create function to handle new user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, role, full_name)
     VALUES (NEW.id, NEW.email, 'patient', NEW.raw_user_meta_data->>'full_name');
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger for new user signup
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── medications/       # Medication management components
│   └── ui/               # Reusable UI components
├── hooks/
│   ├── useAuth.ts        # Authentication hook
│   └── useMedications.ts # Medication management hook
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   └── utils.ts          # Utility functions
├── types/
│   ├── auth.ts           # Authentication types
│   ├── database.ts       # Database types
│   └── medication.ts     # Medication types
└── test/                 # Test files
```

## 🧪 Testing

The project includes comprehensive tests using Vitest and Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Key Features Implementation

### Authentication
- Custom `useAuth` hook with React Context
- Supabase Auth integration with email/password
- Role-based access control
- Profile management

### Medication Management
- Custom `useMedications` hook with React Query
- CRUD operations with optimistic updates
- Real-time adherence calculation
- Daily medication tracking

### State Management
- React Query for server state
- Optimistic updates for better UX
- Proper error handling and loading states

### Type Safety
- Comprehensive TypeScript types
- Database schema types
- Proper generic usage
- No `any` types used

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

## 🔒 Security Considerations

- Row Level Security (RLS) enabled on all tables
- Proper authentication checks
- Input validation with Zod schemas
- Secure API endpoints through Supabase

## 📈 Performance Optimizations

- React Query caching and background updates
- Optimistic updates for immediate feedback
- Lazy loading of components
- Efficient re-render prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.