# Site Achat Amendis

**Site Achat Amendis** is a full-stack digital procurement and tender management application developed to simplify the process of publishing tenders and submitting bids between companies and Amendis.

The application allows companies to view available tenders, submit bids with the required technical and financial documents, and manage their submissions. Administrators can review and approve tenders before they are published.

## How It Works

```text
Administrator / Company
        ↓
   Create Tender
        ↓
   Review & Approval
        ↓
   Published Tender
        ↓
 Companies Submit Bids
        ↓
    Bid Evaluation
```

The system uses **role-based access control (RBAC)** to provide different permissions for administrators and company users. Authentication is handled using JWT, while submitted documents are securely handled through the backend API.

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL / Neon
- JWT Authentication
- bcrypt
- Zod
- Multer
- Swagger / OpenAPI
- Vitest & Supertest

### Mobile Application
- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Expo SecureStore
- Expo Document Picker

## Architecture

The project consists of two main parts:

```text
Site_Achat_Amendis_App/
│
├── Mini_Tender_API/       # REST API & Backend
│
├── mini-tender-mobile/    # React Native Mobile App
│
└── README.md
```

The mobile application communicates with the backend through a RESTful API. The backend handles authentication, authorization, business logic, database operations, tender management, bid submissions, and document uploads.

## Main Features

- User authentication and JWT sessions
- Role-Based Access Control
- Tender creation and management
- Administrative tender approval
- Tender listing and details
- Company bid submission
- Technical and financial document uploads
- My Bids management
- PostgreSQL database with Prisma
- Swagger API documentation
- Automated backend integration tests
- Mobile interface for Android

## Project Purpose

This project was developed as part of a software engineering internship, with the first phase focusing on **backend development** and the second phase focusing on the **React Native mobile application**.