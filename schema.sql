-- To execute: psql -U your_username -d your_database -f schema.sql

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS users;

-- For test categories
CREATE TYPE test_type AS ENUM ('standard', 'demo', 'upcoming');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email_or_phone VARCHAR(255) UNIQUE NOT NULL,
    school_name VARCHAR(255),       
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tests table
CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    num_questions INT NOT NULL,
    duration_minutes INT NOT NULL,
    subject_topic VARCHAR(255),
    instructions TEXT,
    test_category test_type NOT NULL DEFAULT 'standard', -- Differentiates test types
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- e.g., {"a": "Option A", "b": "Option B"}
    correct_option CHAR(1) NOT NULL,
    marks INT DEFAULT 1
);

-- Results table
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE,
    score INT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);