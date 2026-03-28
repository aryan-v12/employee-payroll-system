# Employee Payroll Management System

A full-stack web application for managing employee payroll, departments, leaves, and salaries — built with Java Spring Boot and React.

## 🌐 Live Demo

- **Frontend**: https://emp-payroll-system.netlify.app
- **Backend API**: https://employee-payroll-system-uw6d.onrender.com
- **API Docs (Swagger)**: https://employee-payroll-system-uw6d.onrender.com/swagger-ui.html

## 🔑 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Admin@1234 |
| Employee | (register karo) | - |

## 📋 Features

- **Authentication**: Secure JWT-based login & registration
- **Role Based Access**: Admin and Employee roles with different permissions
- **Employee Management**: Add, update, view and delete employee records
- **Department Management**: Organize employees by departments
- **Salary Management**: Auto-calculate salary (HRA, DA, Tax, Net Salary)
- **Leave Management**: Apply, approve and reject leave requests
- **Dashboard**: Real-time analytics and statistics
- **API Documentation**: Swagger UI for all REST endpoints
- **Responsive UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (Supabase)
- **Security**: JWT Authentication, Spring Security
- **ORM**: JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animations**: Framer Motion

### Deployment
- **Backend**: Render (Docker)
- **Frontend**: Netlify
- **Database**: Supabase (PostgreSQL)

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.8+
- PostgreSQL (or Supabase account)
- Docker (for containerized deployment)

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

API Documentation: `http://localhost:8080/swagger-ui.html`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login and get JWT | Public |

### Employees
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/employees | Get all employees | Admin/Employee |
| POST | /api/employees | Add new employee | Admin |
| PUT | /api/employees/{id} | Update employee | Admin |
| DELETE | /api/employees/{id} | Delete employee | Admin |

### Departments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/departments | Get all departments | Admin/Employee |
| POST | /api/departments | Add department | Admin |
| PUT | /api/departments/{id} | Update department | Admin |
| DELETE | /api/departments/{id} | Delete department | Admin |

### Salary
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/salaries/generate/{employeeId} | Generate salary | Admin |
| GET | /api/salaries/{employeeId} | Get salary history | Admin/Employee |

### Leave
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/leaves/apply | Apply for leave | Employee |
| GET | /api/leaves/employee/{employeeId} | Get leave history | Admin/Employee |
| PUT | /api/leaves/approve/{leaveId} | Approve leave | Admin |
| PUT | /api/leaves/reject/{leaveId} | Reject leave | Admin |

## 💰 Salary Calculation Logic
```
HRA = 20% of Basic Salary
DA  = 10% of Basic Salary
Tax =  5% of Basic Salary
Net Salary = Basic + HRA + DA + Bonus - Tax - Deductions
```

## 🔑 Environment Configuration

### Backend (application.properties)
```properties
# Database
spring.datasource.url=jdbc:postgresql://your-db:5432/postgres
spring.datasource.username=your-username
spring.datasource.password=your-password

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Server
server.port=${PORT:8080}
```

### Frontend (.env)
```
VITE_API_URL=https://your-render-backend-url/api
```

## 📦 Deployment

### Backend (Render via Docker)
1. Create account on [Render.com](https://render.com)
2. New → **Web Service** → Connect GitHub repo
3. Runtime → **Docker**
4. Root Directory → `backend`
5. Add environment variables:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`

### Frontend (Netlify)
1. Create account on [Netlify.com](https://www.netlify.com)
2. New Site → Import from GitHub
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL=your-render-backend-url/api`

## ⚠️ Important Notes

- Render free tier **sleeps after 15 minutes** of inactivity — first request may take 30-40 seconds
- Supabase free tier has **500MB** storage limit
- JWT token expires after **24 hours** — re-login required

## 📄 License

This project is licensed under the MIT License.