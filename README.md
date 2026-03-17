# Project Management Frontend

React frontend for the Project Management System.

## Setup & Run

```bash
npm install
npm start
```

App runs at: `http://localhost:3000`

Make sure the Spring Boot backend is running at `http://localhost:8080`.

## Features

- JWT Authentication (Login / Register)
- Dashboard with project and task stats
- Create, view, delete Projects
- Create, view, update status, delete Tasks
- User management (Admin only)
- Protected routes

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | All users |
| `/projects` | Projects list | All users |
| `/projects/create` | Create project | All users |
| `/tasks` | My tasks | All users |
| `/tasks/create` | Create task | All users |
| `/users` | Users list | Admin only |

## Tech Stack

- React 18
- React Router v6
- Axios
- Context API for auth state
