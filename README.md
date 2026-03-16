# Voxaro

**Live:** [voxaro.co](https://voxaro.co)

Voxaro is a language learning social app where users record themselves saying a word or phrase, share it as a post, and get feedback from others through comments and likes. It also includes a listening quiz to practice recognizing words by ear.

---

## Technologies

**Frontend**

- React 19 + Vite
- React Router, React Hook Form, Zod
- Axios
- Pexels API (background images)

**Backend**

- Java 21 / Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL
- AWS S3 (audio file storage)

---

## Installation

### Backend

1. Clone the repo and navigate to the backend folder:

   ```bash
   cd speak-check-backend
   ```

2. Create a `.env` file or set the following environment variables:

   ```
   DB_URL=jdbc:mysql://localhost:3306/voxaro
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=86400000
   RAILWAY_S3_ENDPOINT=your_s3_endpoint
   RAILWAY_S3_BUCKET=your_bucket_name
   RAILWAY_S3_ACCESS_KEY=your_access_key
   RAILWAY_S3_SECRET_KEY=your_secret_key
   RAILWAY_S3_REGION=your_region
   ```

3. Run the app:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Create a `.env` file:

   ```
   VITE_API_BASE_URL=http://localhost:8080
   VITE_PEXELS_ACCESS_KEY=your_pexels_api_key
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

---

## Wireframes

[View on Figma](https://www.figma.com/design/83kdlKFYYbHfn2Lu1yKDCH/Mike-Melikhan-s--Final-Project?node-id=0-1&t=GsOrtyHxWKeevuZN-1)

---

## ER Diagram

[View ERD](https://drive.google.com/file/d/1zlAovgCV9UsKCMdR6Xc7cwffE4GqMJmQ/view?usp=sharing)

---

## Unsolved Problems & Future Features

- Game room feature is currently under construction
- No pagination on the feed yet — will be added for performance
- Leaderboard and user profile pages planned for a future update
