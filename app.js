const inquirer = require('inquirer')
const table = require('console.table')

const Employee = require('./app/classes')
// module to connect to database
const db = require('./app/connection')('employee_trackerDB', 'rootroot')

// database actions
function getAll(table) {
    const sql = `SELECT * FROM ${table};`
    console.log(`[getInfo] ${sql}`)
    return db.query(sql)
}

function getSpecific(table, id) {
    const sql = `SELECT * FROM ? WHERE id = ?`
    console.log(`[getInfo] ${sql}`)
    return db.query(sql, [table, id])
}
function getEmployeesInfo(){
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id;`
    return db.query(sql)
}

function addDepartment(id, name) {
    const sql = `INSERT INTO departments VALUES (? , ?)`
    return db.query(sql, [id, name])
}

function addRole(id, title, salary, department) {
    const sql = `INSERT INTO roles VALUES (? , ?, ?, ?)`
    return db.query(sql, [id, title, salary, department])
}

function addEmployee(id, firstName, lastName, roleId, managerId) {
    if (managerId === undefined) {
        managerId = null
    }
    const sql = `INSERT INTO employees VALUES (? , ?, ?, ?, ?)`
    return db.query(sql, [id, firstName, lastName, roleId, managerId])
}

function updateEmployee(newRole, id) {
    const sql = `UPDATE employees SET role = ? WHERE id = ?`
    return db.query(sql, [newRole, id])
}

async function main() {
    let employees= []
    let roles = []
    let departments=[]
    let managers = []
    let choice = await inquirer.prompt(
        { Message: "What would you like to do?", name: "choice",type: "list", choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Update Employee Role", "Update Employee Manager"] }
    )
    switch(choice.choice){
        case "View All Employees":
            let employeeData= await getEmployeesInfo()
        
            for (let i =0 ; i < employeeData.length; i++){
                let uniqueEmployee = new Employee (employeeData[i].id, employeeData[i].first_name, employeeData[i].last_name, employeeData[i].manager_id, employeeData[i].title, employeeData[i].salary, employeeData[i].name,) 
                employees.push(uniqueEmployee)
            }
            
            console.table(employees)
            break
        case "View All Employees By Department":

            break
        case "View All Employees By Manager":
            break
        case "Add Employee":
            break
        case "Update Employee Role":
            break
        case "Update Employee Manager":
            break
    }
    db.close()
}

main()
