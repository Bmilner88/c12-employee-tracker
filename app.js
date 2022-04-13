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
        const sql = `SELECT roles.id, roles.title, departments.department, roles.salary
                     FROM roles
                     INNER JOIN departments ON roles.department_id = departments.id`;
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
        const sql = `SELECT e.id, e.first_name, e.last_name,
                     roles.title, departments.department, roles.salary,
                     concat(m.first_name, ' ', m.last_name) manager
                     FROM employees e
                     INNER JOIN roles ON e.role_id = roles.id
                     INNER JOIN departments ON roles.department_id = departments.id
                     LEFT JOIN employees m ON m.id = e.manager_id`;
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
            const sql = `INSERT INTO departments(department) VALUES (?)`;
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
            }
        ]).then(input => {
            const sql = `INSERT INTO roles(title, department_id, salary) VALUES (?,?,?)`;
            const params = [input.title, input.department_id, input.salary];
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
        db.query(`SELECT employees.id, employees.first_name, employees.last_name FROM employees`, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }

            result.forEach(item => {
                const name = `${item.first_name} ${item.last_name}`;
                employees.push(name);
            });

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'update',
                    message: `Who's role do you want to update?`,
                    choices: employees
                },
                {
                    type: 'input',
                    name: 'new_role',
                    message: `What is their new role id?`,
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
                const split = input.update.split(' ');
                
                const sql = `UPDATE employees
                             SET role_id = ${input.new_role}
                             WHERE first_name = '${split[0]}'
                             AND last_name = '${split[1]}'`
                db.query(sql, (err, result) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log(result);
                    restart();
                });
            });
        });
    };
    
    options();
};

init();