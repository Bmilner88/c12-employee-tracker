const inquirer = require('inquirer');
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
        const sql = `SELECT * FROM roles`;

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
        const sql = `SELECT * FROM employees`;

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
                viewDepartments();
            });
        });
    };

    function addRole() {

    };

    function addEmployee() {

    };

    function updateRole() {

    };
    
    options();
};

init();