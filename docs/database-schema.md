# Database Schema

This document defines the database structure for the Book Tracker application.

The system uses PostgreSQL as the primary relational database and Prisma ORM for type-safe database access and migrations.

The schema is designed to support the MVP while allowing for future expansion such as recommendations, analytics, and social features.

---

## Entity Overview

Core entities:
- User
- Book
- UserBook (junction table)
- Genre (standardized genre categories)
- BookGenre (junction table)

High-level relationships:
- A User can have many UserBook records
- A Book can belong to many UserBook records
- UserBook connects a specific User to a specific Book and stores reading progress and status
- A Book can have many Genres via BookGenre
- A Genre can apply to many Books via BookGenre

---

## User Table

Stores user account information.

Fields:

- id (Primary Key, integer, auto-increment)
- email (string, unique, required)
- passwordHash (string, required)
- createdAt (timestamp, default current time)
- updatedAt (timestamp, auto-updated)

Purpose:

- Stores authentication credentials
- Identifies ownership of library data

---

## Book Table

Stores book metadata.

Fields:

- id (Primary Key, integer, auto-increment)
- title (string, required)
- author (string, required)
- coverUrl (string, optional)
- isbn (string, optional)
- createdAt (timestamp, default current time).
- updatedAt (timestamp, auto-updated)

Purpose:

- Stores reusable book information
- Allows multiple users to reference the same book

Future expansion:

- description
- external API identifiers

---

## UserBook Table

Junction table representing a user's relationship with a book.

Fields:

- id (Primary Key, integer, auto-increment)
- userId (Foreign Key → User.id)
- bookId (Foreign Key → Book.id)
- status (string, required)
- progress (integer, required, default 0)
- createdAt (timestamp, default current time)
- updatedAt (timestamp, auto-updated)

Status values (MVP):

- planned
- reading
- completed

Purpose:

- Tracks user's personal library
- Stores reading progress
- Allows independent progress tracking per user

---

## Genre Table (Planned)

Stores standardized genre categories that can be associated with books.

Genres are stored in a separate table to support consistent categorization, efficient querying, and future features such as filtering, analytics, and recommendations.

Fields:

- id (Primary Key, integer, auto-increment)
- name (string, unique, required)
- createdAt (timestamp, default current time)

Examples:

- Fiction
- Fantasy
- Science Fiction
- Mystery
- Romance
- Nonfiction

Purpose:

- Enables consistent genre classification
- Supports filtering books by genre
- Enables analytics and recommendations based on reading patterns

---

## BookGenre Table (Planned)

Junction table connecting books and genres.

This enables a many-to-many relationship because a book can have multiple genres, and a genre can apply to many books.

Fields:

- id (Primary Key, integer, auto-increment)
- bookId (Foreign Key → Book.id)
- genreId (Foreign Key → Genre.id)
- createdAt (timestamp, default current time)

Constraints:

- Unique composite constraint on (bookId, genreId) to prevent duplicate assignments

Purpose:

- Allows books to be associated with multiple genres
- Supports scalable genre classification
- Enables future filtering and recommendation features

---

## Relationships Diagram (Conceptual)

User
  |
  | 1-to-many
  |
UserBook
  |
  | many-to-1
  |
Book
  |
  | many-to-many
  |
BookGenre
  |
  | many-to-1
  |
Genre



---

## Indexing Strategy (Planned)

Indexes improve query performance.

Planned indexes:

- User.email (unique index)
- UserBook.userId
- UserBook.bookId
- Book.title (optional, future)
- Genre.name (unique index)

Future composite indexes:

- UserBook.userId + status (for filtering by reading status)

---

## Migration Strategy

Database schema changes will be managed using Prisma migrations.

Benefits:

- Version-controlled schema changes
- Safe schema evolution
- Consistent environments across development and production

---

## Future Schema Extensions

Planned future tables:

ReadingGoal
- userId
- goalType
- goalValue
- progress

Review
- userId
- bookId
- rating
- reviewText

Recommendation
- userId
- bookId
- recommendationSource

---

## Design Principles
- Normalize data to reduce duplication
- Use relational integrity via foreign keys
- Keep MVP schema simple
- Allow scalable expansion
