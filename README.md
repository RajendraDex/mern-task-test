# 📘 Project Management & Task Tracking App

A full-featured project and task management system with authentication, role-based access control, and collaborative tools.

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/project-management.git
cd project-management
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment

Create a `.env` file from the sample:

```bash
cp .env.example .env
```

Update MongoDB URI, JWT secrets, and other configs.

### 4. Run the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## 🧱 Architecture Overview

* **Backend:** Node.js + Express.js + MongoDB
* **Frontend:** React + TypeScript + MUI
* **Authentication:** JWT + Role-based access
* **ORM:** Mongoose
* **Validation:** Joi
* **Logging/Error:** Custom middleware + `ApiError`

```
📦 src
├── api/               # External API handlers
├── controllers/       # Route controllers
├── middlewares/       # Auth, error, validation
├── models/            # Mongoose schemas
├── routes/            # Express routes
├── services/          # Business logic
├── types/             # Shared types/enums
├── utils/             # Helpers (pagination, jwt, etc)
└── validations/       # Joi validators
```

---

## 🛠 Technologies Used

* **Frontend:** React, React Router, MUI, Formik
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB
* **Auth:** JWT (Access + Refresh), Role-based
* **Testing:** Jest (optional)

---

## 📚 API Documentation

### 🔐 Auth

* `POST /auth/register` - Register user
* `POST /auth/login` - Login
* `POST /auth/logout` - Logout
* `GET /auth/me` - Get current user

### 📁 Projects

* `POST /projects/create` - Create a project
* `PUT /projects/:projectId` - Update
* `DELETE /projects/:projectId` - Remove
* `POST /projects/list` - List w/ pagination
* `GET /projects/:projectId` - View details
* `POST /projects/:projectId/add-member` - Assign members

### 📋 Tasks

* `POST /create-project-tasks/:projectId` - Create task
* `PATCH /update-task-status/:taskId` - Update status
* `GET /get-user-task/:userId` - Get user's tasks

### 📊 Dashboard

* `GET /dashboard/stats` - Project/task stats
* `GET /dashboard/user-stats` - Tasks grouped by user
* `GET /dashboard/project-progress` - Task completion per project

---

## 🖼️ Screenshots

![Dashboard](docs/screens/dashboard.png)
![Projects](docs/screens/projects.png)
![Tasks](docs/screens/tasks.png)

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © 2025 Your Name
