const inquirer = require('inquirer');
const db = require('./db/connection');

function init() {
    function options() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            },
        ]).then(input => {
            switch(input.action) {
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

    };

    function addDepartment() {

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