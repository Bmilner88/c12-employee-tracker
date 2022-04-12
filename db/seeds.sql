INSERT INTO departments(department)
VALUES 
('Information Technology'),
('Accounting'),
('Human Resources');

INSERT INTO roles(title, department_id, salary)
VALUES
('IT Specialist', 1, 27000),
('IT Professional', 1, 36000),
('Back-End Developer', 1, 80000);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Jonah', 'Milner', 3, null),
('Ben', 'Milner', 1, 1);