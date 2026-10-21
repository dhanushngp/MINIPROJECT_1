# 🎓 AI Descriptive Answer Evaluator

An intelligent academic assessment platform powered by **Google Gemini Multimodal AI** and **React 19**. It transcribes handwritten test papers, exams, assignments, and study notes, evaluates factual soundness, scores answers out of 10, pinpoints missing keywords, and generates model answer keys.

---

## 🌟 Key Features

### 1. ✍️ Multimodal Handwriting OCR & Analysis
- **Automatic Question-Answer Detection:** Automatically separates distinct questions and corresponding student handwritten responses.
- **Logical Soundness & Accuracy:** Grades primarily based on technical correctness, scientific laws, and conceptual depth rather than penalizing penmanship style.

### 2. 🎯 Customizable Evaluation Rubrics & Teacher Answer Key
- **Three Strictness Modes:**
  - **Strict Mode:** Board & competitive exam level. Deducts marks for omissions, lack of formal terms, and vague reasoning.
  - **Balanced Mode (Default):** Standard university undergraduate evaluation balancing facts, structure, and clarity.
  - **Generous Mode:** Formative school assessment rewarding intuition, effort, and core concepts.
- **Teacher's Reference Answer Key:** Paste an optional marking scheme or expected points for the AI to cross-reference against.
- **Subject Domain Specialization:** Computer Science, Physics, Chemistry, Biology, Mathematics, Engineering, Humanities, and General Descriptive.

### 3. 🔬 Interactive Document Inspection
- **Side-by-Side Document Viewer:** Zoom (up to 300%), rotate (90° increments), and fullscreen inspection.
- **High Contrast / Invert Ink Filter:** Enhances readability for faint pencil or low-contrast ballpoint handwriting.
- **AI OCR Transcript Tab:** View the raw extracted text transcription alongside the original paper.

### 4. 📊 Multi-Dimensional 5-Criteria Rubric Breakdown
Evaluates each answer and the entire paper across 5 independent axes:
1. **Factual & Technical Accuracy (0-10)**
2. **Conceptual Reasoning & Depth (0-10)**
3. **Key Terminology & Syllabus Coverage (0-10)**
4. **Clarity, Coherence & Flow (0-10)**
5. **Language, Tone & Presentation (0-10)**

### 5. 💡 Actionable Student Feedback & Model Answers
- **Key Concepts Covered vs. Missing:** Visual green/amber pills highlighting included keywords vs. omitted concepts.
- **Full 10/10 Model Answers:** Provides an ideal answer for every question showing how to achieve maximum marks.
- **Audio Speech Feedback (TTS):** Integrated Web Speech API narrator reads examiner critiques aloud with play/pause/stop controls.

### 6. 📄 Professional Academic Exporting
- **Official PDF Report:** Publication-grade academic evaluation report with student details, breakdown, criteria scores, and examiner signature line.
- **Print-Ready View:** Clean browser print stylesheet.
- **Gradebook CSV & JSON Export:** Ready for LMS, Excel, or database sync.
- **One-Click Markdown Copy:** Formatted text summary ready to paste into emails.

### 7. 📸 Real-Time Camera Scanner
- Capture handwritten test sheets directly via laptop webcam or mobile camera with an alignment viewfinder frame.

### 8. ⚡ Instant 1-Click Sample Exam Papers
- Test every single feature immediately with pre-loaded handwritten test papers:
  - **Computer Science & Engineering:** Virtual Memory, Page Faults, and Binary Search Trees.
  - **Physics & Applied Sciences:** Thermodynamics, Kelvin-Planck Statement, and Carnot Efficiency.

### 9. 🛡️ Executive / CEO Admin Dashboard
- Centralized monitoring of registered students, total submissions, class average score, and pass rate.
- Inspect individual student papers and download an aggregate master CSV report.
- Secondary passcode verification for administrative security.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- npm or yarn

### Installation & Run

1. **Clone or Navigate to the directory:**
   ```bash
   cd MINIPROJECT_1-main/MINIPROJECT_1-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key (Optional):**
   You can either:
   - Provide your key in `.env`:
     ```env
     VITE_GEMINI_API_KEY="your_api_key_here"
     ```
   - **Or** enter it directly in the in-app **Model Settings** dialog (`Key` icon in top bar).
   - **Or** simply toggle **"Simulated AI / Demo Mode"** to run completely free without any API key!

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access Credentials

- **Student Demo:**
  - Email: `student@university.edu`
  - Password: `student123`
  - *(Click the **"Student Demo"** quick button on the sign-in page)*

- **CEO / Administrator:**
  - Email: `dhanush31101@gmail.com`
  - Password: `test112`
  - Secondary CEO Passcode: `ceo112`
  - *(Click the **"Admin / CEO"** quick button on the sign-in page)*

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Tailwind CSS, Glassmorphism, Inter font
- **AI Engine:** `@google/genai` (Gemini 2.5 Flash, Gemini 2.0 Flash, Gemini 1.5 Flash)
- **Document / Export Utilities:** `jspdf`, `canvas-confetti`, `lucide-react`, Web Speech API
