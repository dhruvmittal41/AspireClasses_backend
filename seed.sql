-- To execute: psql -U your_username -d your_database -f seed.sql

-- Seed Tests
INSERT INTO tests (test_name, num_questions, duration_minutes, subject_topic, instructions, test_category) VALUES
('Algebra Basics', 5, 10, 'Mathematics', 'Choose the correct option for each question.', 'demo'),
('Indian History - Pre-Independence', 10, 15, 'History', 'All questions are mandatory.', 'standard'),
('Physics: Laws of Motion', 10, 20, 'Physics', 'Read each question carefully before answering.', 'standard'),
('Upcoming: Chemistry Basics', 10, 15, 'Chemistry', 'This test will be available soon.', 'upcoming');

-- Seed Questions for Demo Test (Test ID 1)
INSERT INTO questions (test_id, question_text, options, correct_option, marks) VALUES
(1, 'What is 2 + 2?', '{"a": "3", "b": "4", "c": "5", "d": "6"}', 'b', 1),
(1, 'What is the value of x in x + 5 = 10?', '{"a": "3", "b": "4", "c": "5", "d": "10"}', 'c', 1),
(1, 'What is 3 * 8?', '{"a": "24", "b": "11", "c": "21", "d": "38"}', 'a', 2),
(1, 'Simplify the expression: 2(x + 4)', '{"a": "2x + 4", "b": "x + 8", "c": "2x + 8", "d": "2x + 6"}', 'c', 2),
(1, 'What is the square root of 81?', '{"a": "7", "b": "8", "c": "9", "d": "10"}', 'c', 1);

-- Seed Questions for Standard Test (Test ID 2)
INSERT INTO questions (test_id, question_text, options, correct_option, marks) VALUES
(2, 'The Battle of Plassey was fought in?', '{"a": "1757", "b": "1764", "c": "1857", "d": "1947"}', 'a', 1),
(2, 'Who was the first Governor-General of India?', '{"a": "Lord Canning", "b": "Warren Hastings", "c": "Lord Mountbatten", "d": "C. Rajagopalachari"}', 'b', 1);
-- Add more questions for other tests as needed