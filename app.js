const inquirer = require('inquirer')
const table = require('console.table')

const {Department, Role, Employee} = require('./app/classes')
// module to connect to database
const db = require('./app/connection')('employee_trackerDB', 'root')

// database actions
function getAll(table) {
    const sql = `SELECT * FROM ${table};`
    console.log(`[getInfo] ${sql}`)
    return db.query(sql)
}

function getEmployeesInfo(){
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id;`
    return db.query(sql)
}
function getEmployeesByDepartment(departmentId){
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id WHERE departments.department_id = ?;`
    return db.query(sql, [departmentId])
}

function getRoleInfo(){
    const sql = `SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id;`
    return db.query(sql)
}
function addDepartment(name, id) {
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

// non-Database functions
function makeEmployeeList(dbData){
    let employees = []
    for (let i =0 ; i < dbData.length; i++){
        let uniqueEmployee = new Employee (dbData[i].id, dbData[i].first_name, dbData[i].last_name, dbData[i].manager_id, dbData[i].title, dbData[i].salary, dbData[i].name,) 
        employees.push(uniqueEmployee)
    }
    return employees
}

function makeRolesLists(dbData){
    let roles = []
    for (let i =0 ; i < dbData.length; i++){
        let uniqueRole = new Role (dbData[i].title, dbData[i].salary, dbData[i].name)
        roles.push(uniqueRole)
    }
    return roles
}

function makeDepartmentLists(dbData){
    let departments = []
    for (let i =0 ; i < dbData.length; i++){
        let uniqueDepartment = new Department (dbData[i].name)
        departments.push(uniqueDepartment)
    }
    return departments
}

function getRoleTitles(roleData){
    let roleTitles = []
    for (let i =0 ; i < roleData.length; i++){
        roleTitles.push(roleData[i].title)
    }
    return roleTitles
}

// main function
async function main() {
    let returnedData
    let employeeData

    let choice = await inquirer.prompt(
        { name: "choice", message: "What would you like to do?", type: "list", choices: ["View All Employees", "View All Roles", "View All Departments", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Add Role", "Add Department","Update Employee Role", "Update Employee Manager"] }
    )
    switch(choice.choice){
        case "View All Employees":
            employeeData= await getEmployeesInfo()
            console.table(makeEmployeeList(employeeData))
            break
        case "View All Roles":
            returnedData = await getRoleInfo()
            console.table(makeRolesLists(returnedData))
            break
        case "View All Departments":
            returnedData = await getAll('departments')
            console.table(makeDepartmentLists(returnedData))
            break
        case "View All Employees By Department":
            let departmentData = await getAll('departments')
            let choiceList = []
            let departments =[]
            for (let i= 0; i < departmentData.length; i++){
                choiceList.push(departmentData[i].name)
                departments.push({id: departmentData[i].department_id, name: departmentData[i].name})
            }

            let desiredDepartment = await inquirer.prompt({message: "Select a Department", name: "department", choices: choiceList, type: "list"})
            let departmentSearch = departments.find(dep => {return dep.name ===desiredDepartment.department})
            
            employeeData= await getEmployeesByDepartment(departmentSearch.id)
            console.table(makeEmployeeList(employeeData))
            break
        case "View All Employees By Manager":

            break
        case "Add Employee":
            let roleData = await getAll('roles')
            let roleTitles = getRoleTitles(roleData)
            let idName = await inquirer.prompt([{name:"id", message: "What is the id of the employee?"}, {name: "first_name", message: "What is the employee's first name?"}])
            let id = idName.id
            let firstName = idName.first_name
            let remainingInfo = await inquirer.prompt([{name:"last_name", message: `What is ${firstName}'s last name?`}, {name:"role", message:`What is ${firstName}'s role?`, type: "list", choices: roleTitles}, {name: "manager", message: `Who is ${firstName}'s manager?`}])
            
            break
        case "Add Role":
            break
        case "Add Department":
            break
        case "Update Employee Role":
            break
        case "Update Employee Manager":
            break
    }
    db.close()
}

main()
