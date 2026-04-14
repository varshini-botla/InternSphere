<div align="center">

  <img src="https://img.icons8.com/wired/128/3b82f6/sphere.png" alt="InternSphere Logo" width="128" height="128" />

  # 🌐 InternSphere
  **Elevate Your Career. The Elite Internship & Job Marketplace.**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Server-Express-000000?logo=express)](https://expressjs.com/)
  [![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)

  ---

  [Live Demo](#) • [Architecture](#) • [Quick Start](#) • [Docs](#) • [API Reference](#)

</div>

---

### 💻 Tech Stack

<div align="center">

| Frontend | Backend | Database | Styling | Icons | Animation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **React 19** | **Node.js** | **JSON-DB** | **CSS3** | **Lucide** | **Framer Motion** |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | ![JSON](https://img.shields.io/badge/JSON--DB-000000?style=for-the-badge&logo=json&logoColor=white) | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | ![Lucide](https://img.shields.io/badge/Lucide-3b82f6?style=for-the-badge&logo=lucide&logoColor=white) | ![Framer](https://img.shields.io/badge/Framer--Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |

</div>

---

### 🔄 Workflow

<div align="center">

**User Registration** ➔ **Role Selection** (Seeker/Hirer) ➔ **Dashboard Entry** ➔ **Job Post/Apply** ➔ **Status Management**

</div>

---

### 📖 About InternSphere

**InternSphere** is a high-performance, premium web application designed to bridge the gap between ambitious students and industry-leading organizations. Unlike generic job boards, InternSphere focuses on a **curated experience** with a state-of-the-art UI, featuring glassmorphism aesthetics and smooth transitions. 

The platform supports a tripartite ecosystem consisting of **Job Seekers**, **Hirers**, and **Site Administrators**, ensuring a secure and verified hiring pipeline for both internships and full-time positions.

---

### ✨ Key Features

- 👤 **Unified Authentication**: Secure JWT-based login for all user roles.
- 💼 **Job Seeker Portal**: Advanced search, real-time application tracking, and resume management.
- 🏢 **Hirer Dashboard**: Effortless job posting, applicant visualization, and hiring status workflow.
- 🛡️ **Admin Control**: Company verification system to ensure only legitimate opportunities reach students.
- 🎨 **Premium UI**: Modern dark/glassmorphism design using `framer-motion` and `lucide-react`.
- 📁 **Cloud-Ready Media**: Integrated Multer middleware for streamlined file uploads.

---

### 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=InternSphere+Home+Page" alt="Home Page" width="800" />
  <br>
  <em>(Landing Page showcasing premium glassmorphism design)</em>
</div>

---

### 🛠 Installation

#### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

#### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/InternSphere.git
   cd InternSphere
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your configuration
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

### 🚀 Usage

Access the application via your browser:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:5000](http://localhost:5000)

**Default Roles for Testing:**
- Register as a **Seeker** to explore and apply.
- Register as a **Hirer** to post jobs (requires Admin approval).

---

### 📂 Project Structure

```text
📁 InternSphere-main
├── 📁 backend              # Express server & API Logic
│   ├── 📁 controllers      # API route handlers
│   ├── 📁 data             # JSON-based persistence (db.json)
│   ├── 📁 middleware       # Auth & File Upload logic
│   └── 📄 server.js        # Main entry point
├── 📁 frontend             # Vite/React Frontend
│   ├── 📁 src
│   │   ├── 📁 components   # Shared UI components
│   │   ├── 📁 context      # Auth & Global state
│   │   ├── 📁 pages        # Role-specific dashboard views
│   │   └── 📄 App.jsx      # Router & Layout
│   └── 📄 vite.config.js   # Build configuration
└── 📄 README.md            # You are here
```

---

### 🔮 Future Enhancements

- [ ] **AI-Powered Matching**: Recommendation engine for job seekers.
- [ ] **Real-time Chat**: Direct messaging between hirers and applicants.
- [ ] **Interview Scheduler**: Integrated calendar for technical rounds.
- [ ] **Dark Mode Toggle**: Persistent theme switching.

---

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](#) for more information.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by the InternSphere Team**  
*Connecting the next generation of talent with global leaders.*

</div>
