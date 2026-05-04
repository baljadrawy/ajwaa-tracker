-- Ajwaa Tracker - PostgreSQL Initialization Script
-- Database: ajwaa_db
-- User: ajwaa

-- Create database and user (if running as superuser)
-- This section should be run separately if using Docker initialization
-- CREATE USER ajwaa WITH PASSWORD 'ajwaa_secure_password';
-- CREATE DATABASE ajwaa_db OWNER ajwaa;

-- Enable UUID extension for potential future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean initialization)
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS phases CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS environment_type;
DROP TYPE IF EXISTS classification_type;
DROP TYPE IF EXISTS impact_type;
DROP TYPE IF EXISTS priority_type;
DROP TYPE IF EXISTS ticket_status_type;
DROP TYPE IF EXISTS service_status_type;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'coordinator', 'manager');

CREATE TYPE environment_type AS ENUM ('Operation Support', 'BA');

CREATE TYPE classification_type AS ENUM ('تشغيلي', 'تحليلي', 'نقل البيانات');

CREATE TYPE impact_type AS ENUM ('عائق تشغيل', 'غير عائق', 'تحسيني');

CREATE TYPE priority_type AS ENUM ('حرجة', 'عالية', 'متوسطة', 'منخفضة');

CREATE TYPE ticket_status_type AS ENUM ('جديدة', 'تحت الإجراء', 'مغلقة');

CREATE TYPE service_status_type AS ENUM ('قيد التطوير', 'UAT', 'مطلقة', 'مفعلة');

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'coordinator',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- 2. Sectors Table
CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sectors_name ON sectors(name);

-- 3. Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector_id INTEGER NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departments_sector_id ON departments(sector_id);
CREATE INDEX idx_departments_name ON departments(name);

-- 4. Phases Table
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_phases_name ON phases(name);

-- 5. Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector_id INTEGER NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    coordinator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    service_owner VARCHAR(255),
    status service_status_type DEFAULT 'قيد التطوير',
    phase_id INTEGER REFERENCES phases(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_sector_id ON services(sector_id);
CREATE INDEX idx_services_coordinator_id ON services(coordinator_id);
CREATE INDEX idx_services_phase_id ON services(phase_id);
CREATE INDEX idx_services_name ON services(name);

-- 6. Tickets Table with auto-incrementing ticket_number
CREATE SEQUENCE ticket_number_seq START 1;

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    environment environment_type NOT NULL,
    description TEXT NOT NULL,
    classification classification_type NOT NULL,
    impact impact_type NOT NULL,
    priority priority_type NOT NULL,
    status ticket_status_type NOT NULL DEFAULT 'جديدة',
    responsibility VARCHAR(50) NOT NULL,
    observed_date DATE DEFAULT CURRENT_DATE,
    expected_resolution_date DATE,
    closed_date DATE,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_service_id ON tickets(service_id);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_observed_date ON tickets(observed_date);

-- Function to auto-generate ticket_number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := 'T-' || LPAD(nextval('ticket_number_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket_number
CREATE TRIGGER trigger_generate_ticket_number
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION generate_ticket_number();

-- 7. Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 8. Audit Log Table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    old_status ticket_status_type,
    new_status ticket_status_type,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_ticket_id ON audit_log(ticket_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

-- 9. Attachments Table
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_ticket_id ON attachments(ticket_id);
CREATE INDEX idx_attachments_created_at ON attachments(created_at);

-- Insert default admin user
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, password_hash, full_name, role, is_active)
VALUES (
    'admin',
    '$2b$10$dBfGei.P0BBXalxX7fCfHOudIccRxTrwvbgHbEMrQqgz6wr23WQie',
    'مدير النظام',
    'admin',
    true
);

-- Create function to update updated_at timestamp on users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER trigger_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Create function to update updated_at timestamp on services
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for services table
CREATE TRIGGER trigger_update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_services_updated_at();

-- Create function to update updated_at timestamp on tickets
CREATE OR REPLACE FUNCTION update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tickets table
CREATE TRIGGER trigger_update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_tickets_updated_at();

-- جدول سجل الطلبات (access log)
CREATE TABLE IF NOT EXISTS access_log (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    path VARCHAR(500),
    status_code INTEGER,
    duration_ms INTEGER,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_access_log_created_at ON access_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_log_user_id ON access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_access_log_status_code ON access_log(status_code);

-- جدول سجل الأخطاء
CREATE TABLE IF NOT EXISTS error_log (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    path TEXT,
    status_code INTEGER,
    error_message TEXT,
    error_stack TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_error_log_created_at ON error_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_log_status_code ON error_log(status_code);

-- Grant privileges to ajwaa user
GRANT CONNECT ON DATABASE ajwaa_db TO ajwaa;
GRANT USAGE ON SCHEMA public TO ajwaa;
GRANT CREATE ON SCHEMA public TO ajwaa;

-- Grant table privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ajwaa;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO ajwaa;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ajwaa;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ajwaa;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO ajwaa;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ajwaa;
