# PetCare - Full Stack Pet Health Management Dashboard

## 🐾 Project Description
PetCare is a comprehensive full-stack application designed for modern pet parents to manage their pets' daily health, routines, and medical records. Built with an intuitive, premium, and friendly UI/UX, the application supports seamless light and dark modes. It enables holistic tracking of pet health scores, vaccinations, medications, appointments, weight logging, daily routines, and a community feed.

## ✨ Features
- **User Authentication:** Secure sign-up and login securely powered by Supabase Auth mechanism.
- **Smart Dashboard:** Aggregated daily insights, top priority alerts (e.g., overdue medications), and a calculated Pet Health Score.
- **Health Tracking Hub:** 
  - Manage multiple pet profiles.
  - Track **Vaccinations** and **Medications** with due dates and statuses.
  - Log and track **Weight History** with dynamic charts.
- **Daily Operations:** 
  - Schedule **Appointments** (Vet, Grooming, etc.).
  - Check off **Daily Routines** (Walking, Feeding, etc.).
  - Write entries in the **Health Journal**.
- **Resources & Community:**
  - Find nearby **Emergency Vets**.
  - Track **Pet Insurance** policies.
  - Social **Community** feed to share updates with other pet parents.
- **Premium UI/UX:** Mobile-responsive design, dynamic light/dark mode, and soft glassmorphism components.

## 💻 Tech Stack Used
**Frontend Environment:**
- **Framework:** React.js (Bootstrapped with Vite)
- **Styling:** Tailwind CSS (Custom themes, semantic color palettes)
- **UI Components:** ShadCN UI, Lucide React (Icons), Recharts
- **API Communication:** Axios
- **State Management:** React Context API (`AuthContext`, `ThemeContext`, `ToastContext`)
- **Routing:** React Router v6
- **Database / Backend Integration:** Supabase JS Client (PostgreSQL)

## 📂 Standard Folder Structure
Following industry best practices, the application maintains a highly modular and scalable architecture:
```text
src/
│
├── components/       # Reusable, atomic UI components (Buttons, Cards, Modals, Inputs) utilizing Tailwind and headless UI patterns.
├── context/          # Global State Management (AuthContext, ThemeContext, ToastContext) using React Context API.
├── layouts/          # Structural wrappers (DashboardLayout) handling navigation and responsive sidebar logic.
├── pages/            # View components (Home, Login, Register, Dashboard Modules) cleanly separated by feature.
├── services/         # Centralized API logic and Supabase client configuration for organized Backend communication.
├── App.jsx           # Main routing configuration defining public and protected routes.
├── main.jsx          # React DOM entry point integrating top-level Providers.
└── index.css         # Global Tailwind directives, custom fonts, and base animation keyframes.
```

## 🧠 Architecture & Technical Decisions
To ensure code quality, maintainability, and a premium UI/UX, the following architectural decisions were implemented:

1. **State Management:** React Context API was chosen over Redux to manage global state (`Auth`, `Theme`, `Toast` notifications) to reduce boilerplate while maintaining a clean, predictable data flow.
2. **Dynamic Theming:** Dark/Light mode is dynamically handled via `ThemeContext` mutating the `document.documentElement` class. Tailwind's `dark:` modifier is used extensively to map semantic `slate` colors across all components ensuring strict adherence to the Pet Care UI theme.
3. **Protected Routing:** A custom `<RequireAuth />` wrapper intercepts unauthenticated requests to dashboard routes, seamlessly redirecting users to the `/login` portal while preserving their intended destination state.
4. **API Abstraction:** All Supabase interactions and backend API calls are abstracted into the `src/services/api.js` layer. This decoupling ensures UI components remain pure and solely responsible for presentation.

## 🚀 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <frontend-repo-url>
   cd Pet_care_app_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials (provided by your backend configuration):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: If you have a separate Node.js backend URL, configure it here as well.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🌐 Repositories & Deployment
- **Frontend GitHub Repository:** `https://github.com/PothulaNagaJyothi/Pet_care_app_frontend`
- **Backend GitHub Repository:** `https://github.com/PothulaNagaJyothi/Pet_care_app_backend`
- **Frontend Deployment (Netlify):** `[Insert Netlify Link Here]`
- **Backend API Link (Render):** `https://pet-care-app-backend.onrender.com`

## 🔐 Login Credentials (Test Account)
If applicable, use the following credentials to explore the dashboard immediately:
- **Email:** `test@example.com`
- **Password:** `password123`

## 📸 Screenshots
- **Dark Mode Dashboard**
  ![Dark Mode Dashboard](./src/assets/Screenshot%202026-02-28%20210809.png)
  
- **Light Mode Dashboard**
  ![Light Mode Dashboard](./src/assets/Screenshot%202026-02-28%20210835.png)
  
- **Pet Profiles**
  ![Pet Profiles](./src/assets/Screenshot%202026-02-28%20210858.png)

## 🎥 Video Walkthrough Link
- **Demonstration Video:** `[Insert YouTube/Drive Link Here]`
