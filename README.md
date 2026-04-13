# GGTrack

## Introduction

This project aims to create a web platform that allows users to:

- Rate video game titles
- Store video games in a wish list
- Share their experiences and opinions with other users
- Browse ratings made by the community

The application follows a **Frontend + Backend** architecture and communicates through a **REST API**.

---

## Project Architecture

The application consists of two main parts:

### Frontend
- Framework: **Angular**
- Responsible for the user interface
- Consumes the API provided by the backend

### Backend
- Framework: **Django**
- Provides a **REST API**
- Manages users, video games, ratings, and wish lists

---

## Prerequisites

Before running the application, make sure you have the following installed:

### Frontend
- **Node.js** (recommended version: 18 or higher)
- **Angular CLI**
- **npm**

You can install Angular CLI with:
```bash
npm install -g @angular/cli
```

### Backend
- **Python** (version 3.10 or higher)
- **pip**
- **virtualenv** (optional but recommended)
- **Django**

---

## Installation and Execution

### Backend (Django)

1. Navigate to the backend directory:
```bash
cd backend
```

2. (Optional) Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply database migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at:
```
http://localhost:8000/
```

---

### Frontend (Angular)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
ng serve
```

The frontend will be available at:
```
http://localhost:4200/
```

---

## Frontend - Backend Communication

The frontend sends HTTP requests to the backend through a REST API to:

- Retrieve the list of video games
- Create and view ratings
- Manage wish lists
- Handle user authentication

---

## Technologies Used

- **Angular**
- **Django**
- **Python**
- **TypeScript**
- **HTML / CSS**
- **REST API**

---

## Project Status

Academic project

---

## Author

- **Wilson Javier Simbaña Ganazhapa**
