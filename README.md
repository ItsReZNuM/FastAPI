# University Management System 🎓

A modern, high-performance web application built with **FastAPI** 🚀 for managing university data, including students, teachers, and courses. The system features a robust backend with SQLite for data storage, a frontend served via Nginx, and Docker for seamless deployment. It includes strong validation for Persian data inputs and a user-friendly interface for CRUD operations. 🌟

## Features ✨
- **Student Management** 📚: Create, read, update, and delete student records with fields like student ID (STID), name, national ID, address, and more.
- **Teacher Management** 👨‍🏫: Manage teacher profiles with unique teacher IDs, names, and contact details.
- **Course Management** 📋: Handle course information, including course name, units, department, and associated teacher.
- **Data Validation** 🔍: Enforce strict validation rules for Persian names, national IDs, postal codes, phone numbers, and birth dates.
- **Interactive Frontend** 🖥️: A JavaScript-based interface for managing records, with real-time notifications and responsive design.
- **API Documentation** 📖: Automatically generated via FastAPI's OpenAPI support (Swagger UI and ReDoc).
- **Dockerized Deployment** 🐳: Seamless setup with Docker Compose for both backend and frontend services.
- **CORS Support** 🔒: Configured for secure cross-origin requests from specified domains.
- **SSL/TLS Support** 🔐: Configured for secure communication using Let's Encrypt certificates.

## Tech Stack 🛠️
- **Backend**: FastAPI, Python 3.13, SQLAlchemy, Pydantic
- **Database**: SQLite 🗄️
- **Frontend**: HTML, CSS, JavaScript, Nginx 🌐
- **Containerization**: Docker, Docker Compose 🐳
- **Dependencies**: Listed in `requirements.txt` (FastAPI, Uvicorn, SQLAlchemy, Pydantic)

## Prerequisites ✅
- Docker and Docker Compose 🐳
- Python 3.13+ (for local development without Docker) 🐍
- pip (Python package manager) 📦
- Git 🌿

## Installation ⚙️

### Using Docker (Recommended) 🐳
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ItsReZNuM/FastAPI.git
   cd FastAPI
   ```

2. **Set Up SSL Certificates** 🔐:
   - Place your Let's Encrypt certificates in the `/etc/letsencrypt` directory or update the `docker-compose.yml` to match your certificate paths.
   - Replace `yourdomain.com` in `nginx.conf` with your actual domain.

3. **Build and Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   - Backend will be available at `http://localhost:8000` (or `https://api.yourdomain.com` if SSL is configured).
   - Frontend will be available at `http://localhost` (or `https://yourdomain.com`).

### Local Development (Without Docker) 🖥️
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ItsReZNuM/FastAPI.git
   cd FastAPI
   ```

2. **Set Up a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Backend**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   - For SSL, ensure certificates are configured in `main.py` or run without SSL for local testing.

5. **Set Up the Frontend**:
   - Install Nginx locally or use a simple web server (e.g., `python -m http.server`).
   - Copy the `Front_End` directory to your web server's root and configure `nginx.conf` if using Nginx.

## Usage 🚀
1. **Access the API** 📡:
   - **Swagger UI**: `http://localhost:8000/docs` (or `https://api.yourdomain.com/docs`) 📖
   - **ReDoc**: `http://localhost:8000/redoc` (or `https://api.yourdomain.com/redoc`) 📄

2. **Frontend Interface** 🌐:
   - Navigate to `http://localhost` (or `https://yourdomain.com`) to access the web interface.
   - Use the forms to add students 👩‍🎓, teachers 👨‍🏫, or courses 📋.
   - View, edit ✏️, or delete 🗑️ records via the report tables.

3. **Sample Data Generation** 🧪:
   - Run `sample_maker.py` to populate the database with sample data:
     ```bash
     python sample_maker.py
     ```
   - Update `BASE_URL` in `sample_maker.py` to match your API endpoint (e.g., `http://localhost:8000`).

4. **Example API Requests** 📨:
   - **Create a Student**:
     ```bash
     curl -X POST "http://localhost:8000/students" -H "Content-Type: application/json" -d '{"student_fname":"علی","student_lname":"احمدی","father":"حسن","IDS":"123456","BornCity":"تهران","Address":"خیابان نمونه","PostalCode":"1234567890","HPhone":"02112345678","Department":"فنی مهندسی","Major":"مهندسی کامپیوتر","Married":"مجرد","national_id":"1234567890","birth_date":"1370/01/01"}'
     ```
   - **List All Courses**:
     ```bash
     curl -X GET "http://localhost:8000/courses"
     ```

## Project Structure 📂
```
FastAPI/
├── Back_End/                   🖥️ Backend source code
│   ├── main.py                 🚀 FastAPI application entry point
│   ├── requirements.txt        📦 Backend dependencies
│   └── sample_maker.py         🧪 Script for generating sample data
├── Front_End/                  🌐 Frontend source code
│   ├── app.js                  ⚡ Frontend JavaScript logic
│   ├── index.html              📄 Main HTML file (assumed)
│   └── other frontend files    🎨
├── docker-compose.yml          🐳 Docker Compose configuration
├── Dockerfile                  📦 Backend Dockerfile
├── nginx.conf                  ⚙️ Nginx configuration for frontend
└── README.md                   📖 This file
```

## API Endpoints 🌐
- **Students** 👩‍🎓:
  - `POST /students`: Create a new student
  - `GET /students`: List all students
  - `GET /students/{stid}`: Get a student by ID
  - `PUT /students/{stid}`: Update a student
  - `DELETE /students/{stid}`: Delete a student
- **Teachers** 👨‍🏫:
  - `POST /teachers`: Create a new teacher
  - `GET /teachers`: List all teachers
  - `GET /teachers/{teacher_id}`: Get a teacher by ID
  - `PUT /teachers/{teacher_id}`: Update a teacher
  - `DELETE /teachers/{teacher_id}`: Delete a teacher
- **Courses** 📋:
  - `POST /courses`: Create a new course
  - `GET /courses`: List all courses
  - `GET /courses/{course_id}`: Get a course by ID
  - `PUT /courses/{course_id}`: Update a course
  - `DELETE /courses/{course_id}`: Delete a course

## Validation Rules 🔍
- **Persian Names**: Must contain only Persian characters and spaces ✅
- **National ID**: Must be a 10-digit number 🔢
- **Postal Code**: Must be a 10-digit number 📍
- **Phone Number**: Must follow the format `021xxxxxxxx` ☎️
- **Birth Date**: Must be in `yyyy/mm/dd` format, between 1300 and 1400 (Persian calendar) 📅
- **Course Units**: Must be between 1 and 4 📚

## Contributing 🤝
Contributions are welcome! To contribute:
1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature/your-feature`) 🌿
3. Make your changes and commit (`git commit -m "Add your feature"`) ✍️
4. Push to the branch (`git push origin feature/your-feature`) 🚀
5. Open a Pull Request 📬

Please ensure your code follows the project's coding standards and includes appropriate tests.

## Contact 📧
For questions or feedback, feel free to reach out:
- GitHub: [ItsReZNuM](https://github.com/ItsReZNuM) 🌟
- Telegram: [@ItsReZNuM] 
- Instagram: [@rez.num] 
- Email: [rmohamadnia85@gmail.com] 📬