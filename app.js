const inquirer = require('inquirer');
const table = require('console.table');
const db = require('./db/connection');

function init() {
    function options() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['view all departments','view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            },
        ]).then(input => {
            switch(input.action) {
                case 'view all departments':
                    viewDepartments();
                    break;
                case 'view all roles':
                    viewRoles();
                    break;
                case 'view all employees':
                    viewEmployees();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update an employee role':
                    updateRole();
                    break;
            };
        });
    };

    function restart() {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm_restart',
                message: 'Would you like to do something else?',
                default: false
            }
        ])
        .then(confirm => {
            if(confirm.confirm_restart) {
                options();
            } else {
                db.end();
            }
        });
    };

    function viewDepartments() {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
            restart();
        });
    };

    function viewRoles() {
        const sql = ``;
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
            restart();
        });
    };

    function viewEmployees() {
        const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.department_id, roles.salary, departments.title, employees.manager_id
                     FROM employees
                     INNER JOIN roles ON employees.role_id = roles.id
                     INNER JOIN departments ON roles.department_id = departments.id
                     
                     `;
                     /* SELECT department.title
                     FROM departments
                     INNER JOIN employees ON department.id=employees.department_id
                     SELECT * FROM employees */
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
            restart();
        });
    };

    function addDepartment() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'new_department',
                message: 'What is the new department called?'
            }
        ]).then(input => {
            const sql = `INSERT INTO departments (title) VALUES (?)`;
            const params = input.new_department;
            db.query(sql, params, (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`Added ${params} to the database`);
                restart();
            });
        });
    };

    function addRole() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the new role called?'
            },
            {
                type: 'input',
                name: 'salary',
                message: `What is the new role's salary?`,
                validate: input => {
                    if(isNaN(input)) {
                        console.log('Please enter a number');
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: 'input',
                name: 'department_id',
                message: `What is the new role's department id?`,
                validate: input => {
                    if(!isNaN(input)) {
                        return true;
                    } else {
                        console.log(' Please enter a number');
                        return false;
                    };
                }
            }
        ]).then(input => {
            const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`;
            const params = [input.title, input.salary, input.department_id];
            db.query(sql, params, (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`Added ${params[0]} to the database`);
                restart();
            });
        });
    };

    function addEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `What is the new employee's first name?`
            },
            {
                type: 'input',
                name: 'last_name',
                message: `What is the new employee's last name?`
            },
            {
                type: 'input',
                name: 'role_id',
                message: `What is the new employee's role id?`,
                validate: input => {
                    if(!isNaN(input)) {
                        return true;
                    } else {
                        console.log(' Please enter a number');
                        return false;
                    };
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: `What is the new employee's manager id?`,
                validate: input => {
                    if(!isNaN(input)) {
                        return true;
                    } else {
                        console.log(' Please enter a number');
                        return false;
                    };
                }
            }
        ]).then(input => {
            const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [input.first_name, input.last_name, input.role_id, input.manager_id];
            db.query(sql, params, (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`Added ${params[0]} ${params[1]} to the database`);
                restart();
            });
        });
    };

    function updateRole() {
        const employees = [];
        db.query(`SELECT * FROM employees`, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            result.forEach(item => {
                const name = `${item.first_name} ${item.last_name}`;
                employees.push(name);
            })
            console.log(employees)
        })
    };
    
    options();
};

init();