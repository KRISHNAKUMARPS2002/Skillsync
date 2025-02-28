# SkillSync – AI-Powered Learning Path Generator

SkillSync is a full-stack AI-driven web application designed to generate personalized learning roadmaps based on user input. It leverages OpenAI's API to recommend tailored learning paths and resources.

## 🚀 Features
- **Personalized Learning Paths** – AI-generated roadmaps based on user goals and skill levels.
- **User Authentication** – Secure login and registration using JWT / NextAuth.
- **Interactive Dashboard** – View and manage learning progress.
- **Scalable & Responsive** – Optimized for performance and mobile-friendly.

## 🛠️ Tech Stack
### **Frontend**
- [Next.js](https://nextjs.org/) – React-based framework for fast, server-rendered applications.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling.

### **Backend**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) – Fast and scalable backend services.
- [MongoDB (MongoDB Atlas)](https://www.mongodb.com/) – Cloud-based NoSQL database.

### **AI Integration**
- [OpenAI API](https://openai.com/) – Powers AI-generated learning paths.

### **Authentication**
- [JWT / NextAuth](https://next-auth.js.org/) – Secure user authentication.

### **Hosting**
- **Frontend**: [Vercel](https://vercel.com/) for fast deployment.
- **Backend**: Hosted on **AWS** / **Render**.

## 📌 Installation
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/KRISHNAKUMARPS2002/Skillsync.git
cd Skillsync
```

### **2️⃣ Install Dependencies**
#### **Frontend**
```sh
cd frontend
npm install
```

#### **Backend**
```sh
cd backend
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in both frontend and backend directories and configure required API keys:
```env
# Example for Backend
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
```

### **4️⃣ Run the Project**
#### **Start Backend**
```sh
cd backend
npm start
```

#### **Start Frontend**
```sh
cd frontend
npm run dev
```

## 📜 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/learning-path | Fetch AI-generated learning paths |
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login |

## 📖 Roadmap
- [ ] Implement progress tracking
- [ ] Add social login (Google, GitHub)
- [ ] Improve AI model recommendations

## 🎨 UI Design (Figma)
[Check the Figma Design](#) *(Add Figma link when ready)*

## 🤝 Contributing
1. Fork the project.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m 'Added new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## 📄 License
This project is licensed under the MIT License.

## 📬 Contact
**Krishna Kumar P S**  
📧 Email: [your-email@example.com](mailto:your-email@example.com)  
🔗 GitHub: [KRISHNAKUMARPS2002](https://github.com/KRISHNAKUMARPS2002)  
