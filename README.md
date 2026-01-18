# SmartBite

SmartBite is a nutrition tracking web application built with React, Vite, and Tailwind CSS. It helps users log meals, manage their nutrition profile, and leverage AI to analyze food images for calorie and portion estimation.

## Features
- **User Profile Management:** Set age, gender, height, weight, activity level, and fitness goals.
- **Meal Logging:** Add meals with food names, calories, portions, and optional images.
- **AI Integration:** Use Anthropic Claude API to analyze food images and extract nutrition info.
- **Persistent Storage:** Data is saved in browser localStorage.
- **Modern UI:** Built with React and styled using Tailwind CSS and Lucide icons.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd smartbite
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App
Start the development server:
```sh
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `src/` - Source code (React components, styles)
- `public/` - Static assets
- `index.html` - Main HTML file
- `package.json` - Project metadata and scripts

## Configuration
- **Anthropic API Key:** Enter your API key in the settings page to enable AI features.

### Supabase Setup (User Profiles)
1. Create a free Supabase project at https://app.supabase.com
2. Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. In Supabase SQL editor, create the `profiles` table:
   ```sql
   create table profiles (
     id uuid primary key default gen_random_uuid(),
     user_id uuid unique not null,
     full_name text,
     email text,
     avatar_url text,
     bio text,
     preferences jsonb,
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );
   ```
4. Enable Row Level Security (RLS) on the `profiles` table and add policies:
   ```sql
   alter table profiles enable row level security;
   
   create policy "Users can view own profile"
     on profiles for select
     using (auth.uid() = user_id);
   
   create policy "Users can insert own profile"
     on profiles for insert
     with check (auth.uid() = user_id);
   
   create policy "Users can update own profile"
     on profiles for update
     using (auth.uid() = user_id);
   ```
5. Run `npm install` to install the Supabase client.

## License
MIT
