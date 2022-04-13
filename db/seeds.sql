INSERT INTO departments(department)
VALUES 
('Information Technology'),
('Accounting'),
('Human Resources');

INSERT INTO roles(title, department_id, salary)
VALUES
('System Admin', 1, 90000),
('IT Professional', 1, 40000),
('Human Resource Manager', 3, 100000),
('Human Resource Assistant', 3, 40000),
('Accounting Manager', 2, 95000),
('Payroll Accountant', 2, 45000);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Jonah', 'Milner', 1, null),
('Ben', 'Milner', 2, 1),
('Lonny', 'Vandenberg', 3, null),
('Jasmynne', 'Umbaugh', 4, 3),
('Barney', 'Varmn', 5, null),
('Ben', 'Wyatt', 6, 5);