# Mini Tender API

A robust, enterprise-grade RESTful API built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. The platform facilitates digital tendering by enabling companies to publish tenders and submit competitive bids under strict Role-Based Access Control (RBAC) and data integrity constraints.

---

## Architecture & Features

* **Layered Architecture:** Strict separation of concerns across Routes, Controllers, Services, Middlewares, and Data Models.
* **Type Safety:** Full TypeScript implementation ensuring compile-time type safety across all layers.
* **Authentication & Authorization:** Secure JWT (JSON Web Tokens) stateless authentication with granular RBAC (`ADMIN` vs. `COMPANY`).
* **Database & ORM:** PostgreSQL/MySQL management using Prisma ORM with explicit migration history and unique constraints (`@@unique([tenderId, companyId])`).
* **OpenAPI Documentation:** Interactive API documentation is available through Swagger UI: http://localhost:3000/docs
* **Automated QA Suite:** In-memory integration testing powered by **Vitest** and **Supertest** ensuring end-to-end API correctness without live port binding.
* **Security & Observability:** CORS policy configuration, centralized error handling.

---

## Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Runtime & Framework** | Node.js (v18+), Express.js |
| **Language** | TypeScript |
| **Database & ORM** | PostgreSQL / MySQL, Prisma ORM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt |
| **API Documentation** | Swagger UI (`swagger-ui-express`, `swagger-jsdoc`) |
| **Testing Framework** | Vitest, Supertest |
| **Utilities** | CORS, Morgan, Dotenv |

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:
* Node.js (v18.x or later)
* npm (v9.x or later)
* PostgreSQL or MySQL server

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/Mini-Tender-Api.git](https://github.com/your-username/mini-tender-api.git)
   cd mini-tender-api