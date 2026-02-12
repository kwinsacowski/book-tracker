# System Architecture

This document describes the architecture for the Book Tracker application, including the web app, mobile app, backend API, database, and supporting infrastructure. The goal is to build a scalable, production-grade system with a clean developer experience and room for future enhancements.

---

## High-Level Overview

The application consists of:

- **Web Client:** Next.js (TypeScript)
- **Mobile Client:** Flutter (Dart) with offline-first capability
- **Backend API:** NestJS (TypeScript) providing REST endpoints
- **Database:** PostgreSQL with Prisma ORM
- **CI/CD:** GitHub Actions (planned)
- **Hosting:** Vercel (web), Railway/Render (API + database) (planned)

Both the web and mobile clients communicate with the backend API. The backend owns authentication, business logic, and persistence.

---

## Architecture Diagram (Conceptual)

+-------------------+ +-------------------+
| Next.js Web | | Flutter Mobile |
| (TypeScript) | | (Dart) |
+---------+---------+ +---------+---------+
| |
| HTTPS (REST) | HTTPS (REST)
| |
+------------+---------------+
|
v
+-------------------+
| NestJS API |
| (TypeScript) |
+---------+---------+
|
| Prisma ORM
|
v
+-------------------+
| PostgreSQL |
+-------------------+

---

## Key Design Goals

- **Scalable foundation:** Clear separation between clients and backend API
- **Type safety:** TypeScript across web + backend; Prisma for typed DB access
- **Offline-first mobile:** Mobile app supports offline usage and sync when online
- **Security-first:** JWT authentication for protected resources
- **Maintainability:** Modular services and domain-driven modules in NestJS
- **Testability:** Unit and integration testing planned; CI will enforce quality

---

## Core Domains (Backend)

Initial modules planned for the NestJS backend:

- **Auth**
  - Registration, login
  - JWT token issuance and verification
- **Users**
  - User profile and settings
- **Books**
  - Book records and search (MVP: basic CRUD; later: external book API)
- **UserBooks (Library)**
  - A user’s saved books, status (reading/completed/wishlist), progress
- **Sync (Later)**
  - Supports mobile offline sync strategies if needed beyond basic CRUD

---

## Data Model (MVP)

The MVP data model is designed to be simple while supporting growth:

- **User**
  - id, email, passwordHash, createdAt
- **Book**
  - id, title, author, coverUrl (optional), isbn (optional)
- **UserBook**
  - id, userId, bookId, status, progress, updatedAt

Key relationship:
- A **User** has many **UserBooks**
- A **Book** can belong to many users via **UserBooks**

---

## API Style

- **RESTful endpoints** with JSON payloads
- Standard HTTP status codes
- Validation at the controller boundary (DTO validation)
- Consistent error responses

Example endpoint groups (planned):
- `POST /auth/register`
- `POST /auth/login`
- `GET /books`
- `POST /user-books`
- `PATCH /user-books/:id` (progress/status updates)

---

## Authentication & Authorization

- JWT-based authentication
- Protected endpoints require an `Authorization: Bearer <token>` header
- Passwords stored as secure hashes (bcrypt)
- Authorization rules (MVP):
  - Users can only access/modify their own library items (`UserBook` records)

---

## Offline Mode (Mobile)

Offline mode is planned for the Flutter app.

MVP approach:
- Store a local copy of the user’s library and progress in a local database (e.g., SQLite)
- Allow updates while offline
- When connectivity returns:
  - Sync changes to the backend
  - Resolve conflicts using a simple strategy (e.g., "last updated wins" based on timestamps)

Offline mode is initially limited to:
- Viewing saved library data
- Updating progress/status for existing saved items

---

## Testing Strategy (Planned)

Backend:
- Unit tests for services (Jest)
- Integration tests for controllers/endpoints (Jest + Supertest)
- Separate test DB strategy (containerized Postgres or dedicated test database)

Web:
- Component tests for key UI components
- Basic integration tests for authenticated flows

Mobile:
- Widget tests for key screens
- Tests for offline storage + sync behavior

---

## CI/CD (Planned)

GitHub Actions will be used to:
- Run linting checks
- Run unit/integration tests
- Validate builds for backend and web
- Optionally generate coverage reports

Deployments (planned):
- Web: Vercel (connected to `main`)
- API: Railway/Render (connected to `main`)

---

## Future Enhancements

Planned expansion areas:
- External book metadata integrations (e.g., Google Books API / Open Library)
- Reading goals, streaks, and analytics
- Social features (friends, sharing, recommendations)
- Full-text search and improved discovery
- Caching and performance improvements (Redis, search indexing)

---

## Notes

This architecture is intentionally designed to ship an MVP quickly while maintaining a strong foundation for future scalability and features.
