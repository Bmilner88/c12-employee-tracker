INSERT INTO departments(title)
VALUES 
('Information Technology'),
('Accounting'),
('Human Resources');

INSERT INTO roles(title, salary, department_id)
VALUES
('IT Specialist', 27000, 1),
('IT Professional', 36000, 1),
('Back-End Developer', 80000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Ben', 'Milner', 1, 1),
('Jonah', 'Milner', 3, 1);