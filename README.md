# Employee Payroll System

A full-stack web application for managing employee payroll, departments, leaves, and salaries.

## 📋 Features

- **Employee Management**: Add, update, and manage employee records
- **Department Management**: Organize employees by departments
- **Salary Management**: Track and manage employee salaries
- **Leave Management**: Manage employee leave requests and balances
- **Dashboard**: Real-time analytics and statistics
- **Authentication**: Secure JWT-based authentication
- **Responsive UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (Supabase)
- **Security**: JWT Authentication, Spring Security
- **ORM**: JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.8+
- PostgreSQL (or Supabase account)

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

## 📚 API Documentation

Once the backend is running, view the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
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
```

### Frontend (CORS is handled in Vite proxy)
The frontend automatically proxies API requests to the backend during development.

## 📦 Deployment

### Backend (Render)
1. Create account on [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `mvn clean install`
5. Set start command: `java -jar target/employee-payroll-system-0.0.1-SNAPSHOT.jar`
6. Add environment variables for database and JWT

### Frontend (Netlify)
1. Create account on [Netlify.com](https://www.netlify.com)
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=your-render-backend-url`

## 📄 License

This project is licensed under the MIT License.
