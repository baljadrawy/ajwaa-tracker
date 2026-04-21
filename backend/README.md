# Ajwaa Tracker Backend

Node.js/Express backend for the Ajwaa Operations Tracker system.

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (or run via Docker Compose from root)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=4000
NODE_ENV=development
DB_USER=ajwaa
DB_PASSWORD=ajwaa_pass
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ajwaa_db
JWT_SECRET=ajwaa-secret-key-2026
FRONTEND_URL=http://localhost:5173
```

## Running

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker compose up -d backend
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js           # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── routes/
│   │   ├── auth.js         # Login and profile endpoints
│   │   ├── users.js        # User management (admin)
│   │   ├── services.js     # Service management
│   │   ├── sectors.js      # Sector management
│   │   ├── tickets.js      # Ticket CRUD and comments
│   │   ├── attachments.js  # File uploads/downloads
│   │   └── export.js       # CSV export
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── package.json
└── Dockerfile
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/me` - Get current user info

### Users (admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

### Services
- `GET /api/services` - List services (with filters)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Sectors
- `GET /api/sectors` - List all sectors
- `GET /api/sectors/:id` - Get sector by ID
- `POST /api/sectors` - Create sector (admin only)
- `PUT /api/sectors/:id` - Update sector (admin only)
- `DELETE /api/sectors/:id` - Delete sector (admin only)
- `GET /api/sectors/departments/list` - Get all departments
- `GET /api/sectors/phases/list` - Get all phases

### Tickets
- `GET /api/tickets` - List tickets (with filters)
  - Filters: service, status, priority, classification, impact, responsibility, startDate, endDate
  - Coordinators see only their services' tickets
- `GET /api/tickets/:id` - Get ticket details with comments and attachments
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `POST /api/tickets/:id/comments` - Add comment to ticket
- `GET /api/tickets/stats/dashboard` - Get dashboard statistics

### Attachments
- `POST /api/attachments/upload/:ticketId` - Upload file (max 10MB)
- `GET /api/attachments/download/:id` - Download file
- `DELETE /api/attachments/:id` - Delete attachment

### Export
- `GET /api/export/excel` - Export filtered tickets as CSV

## Database Schema

### users
- id (pk)
- username (unique)
- full_name
- password_hash
- role (admin, coordinator, manager)
- is_active
- created_at

### sectors
- id (pk)
- name

### services
- id (pk)
- name
- sector_id (fk)
- department
- coordinator_id (fk)
- service_owner
- status
- phase
- created_at

### tickets
- id (pk)
- ticket_number (unique, auto)
- service_id (fk)
- environment
- description
- classification
- impact
- priority
- status
- responsibility
- detection_date
- expected_resolution_date
- closure_date
- created_by (fk)
- created_at
- updated_at

### comments
- id (pk)
- ticket_id (fk)
- comment_text
- created_by (fk)
- created_at

### audit_logs
- id (pk)
- ticket_id (fk)
- old_status
- new_status
- changed_by (fk)
- changed_at

### attachments
- id (pk)
- ticket_id (fk)
- file_name
- file_path
- uploaded_by (fk)
- uploaded_at

## Authentication

Uses JWT tokens. After login, include token in Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire after 24 hours.

## Error Handling

All errors are returned with appropriate HTTP status codes and Arabic error messages.

## File Uploads

- Maximum file size: 10MB
- Allowed types: images (JPG, PNG, GIF, WebP), documents (PDF, DOC, DOCX, XLS, XLSX), text
- Files stored in `uploads/` directory with unique names

## Notes

- All database operations use prepared statements for SQL injection prevention
- Passwords are hashed with bcryptjs (10 rounds)
- Soft deletes for users (is_active flag)
- Status changes create audit log entries
- Coordinators can only see tickets for their assigned services
