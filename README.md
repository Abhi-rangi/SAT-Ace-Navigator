
# SAT Ace Navigator 🎓

**The ultimate companion for students to find prep courses, local tutors, and state-specific practice tests.**

SAT Ace Navigator is an AI-powered application designed to help students optimize their SAT preparation journey. By leveraging Google's Gemini API, it provides personalized course recommendations, admission insights, and connects users with local tutors and practice resources.

## ✨ Features

- **AI-Driven Course Finder**: Get top 5 SAT preparation course recommendations tailored to your budget, preferred format (Online/In-Person), and target score increase.
- **Smart Analytics**: Visualize course data with interactive charts comparing price, duration, and score improvements.
- **Admission Insights**: receive encouraging, data-backed tips on how SAT scores correlate with elite college acceptances.
- **Local Tutor Finder**: Locate highly-rated tutors in your area for specific subjects (Math, Reading, Writing) with detailed summaries.
- **Practice Hub**: Access state-specific practice tests, syllabus updates, and drill resources.
- **Responsive Design**: A premium, mobile-friendly interface built with modern UI principles.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI SDK (Gemini)
- **Visualization**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sat-ace-navigator.git
   cd sat-ace-navigator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   > **Note**: The application is configured to read `GEMINI_API_KEY` and expose it as `process.env.API_KEY` via Vite configuration.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` (or the port shown in your terminal).

## 📂 Project Structure

- `App.tsx`: Main application component containing the core logic and layout.
- `components/`: Reusable UI components (CourseCard, StatsChart, FilterBar, etc.).
- `services/`: API integration services (Gemini AI service).
- `types.ts`: TypeScript definitions for data models.
- `vite.config.ts`: Vite configuration, including environment variable handling.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
