# 🎨 Canvas Editor

A powerful and intuitive 2D Canvas Editor web application built with React, Fabric.js, and Supabase. Create, edit, and share your designs with a unique shareable link.

![Canvas Editor](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![Supabase](https://img.shields.io/badge/Supabase-2.x-green)

## ✨ Features

- **🎯 Shape Tools**: Add rectangles, circles, and text to your canvas
- **✏️ Drawing Tool**: Free-hand drawing with customizable colors
- **🎨 Color Picker**: Change colors of any selected object
- **🔄 Object Manipulation**: Move, resize, and rotate objects freely
- **💾 Auto-Save**: Save your canvas to the cloud with one click
- **🔗 Shareable Links**: Each canvas gets a unique URL for easy sharing
- **⌨️ Keyboard Shortcuts**: Quick delete with Delete/Backspace keys
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3 with Vite
- **Canvas Library**: Fabric.js 5.3
- **Backend/Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM 6
- **Styling**: Pure CSS (no frameworks)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- A **Supabase account** (free tier works perfectly)
- A **Firebase account** (free tier works perfectly)

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Step 2.1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up or sign in
3. Click "New Project"
4. Fill in project details (name, database password, region)
5. Wait 2-3 minutes for setup to complete

#### Step 2.2: Create Database Table

1. In Supabase Dashboard, go to **SQL Editor**
2. Run this SQL to create the table:

```sql
CREATE TABLE canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  canvas_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on canvases" 
  ON canvases FOR ALL USING (true) WITH CHECK (true);
```

#### Step 2.3: Get Your Supabase Credentials

1. Go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

1. Copy `.env.example` to create a new `.env` file:

```bash
copy .env.example .env
```

2. Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Important**: Never commit your `.env` file to version control!

### 4. Run the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## 📖 How to Use

### Creating a New Canvas

1. Open the app in your browser
2. Click the **"✨ Create New Canvas"** button
3. You'll be redirected to the canvas editor with a unique URL

### Using the Canvas Editor

- **Add Shapes**: Use toolbar buttons to add rectangles, circles, or text
- **Draw**: Click the Draw button to enable free-hand drawing
- **Edit Objects**: Click to select, drag to move, use handles to resize/rotate
- **Change Colors**: Select an object and use the color picker
- **Delete**: Select an object and press Delete key or click Delete button
- **Save**: Click Save Canvas button to persist your work to Supabase

## 🐛 Troubleshooting

### Supabase Connection Issues
1. Check that your `.env` file has the correct Supabase credentials
2. Ensure the `canvases` table exists in your Supabase project
3. Verify Row Level Security policies are configured

### Canvas Not Loading
1. Check browser console for errors (F12)
2. Ensure you have a valid canvasId in the URL
3. Try refreshing the page


