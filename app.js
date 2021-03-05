const inquirer = require('inquirer')
const table = require('console.table')

const { Department, Role, Employee } = require('./app/classes')
// module to connect to database
const db = require('./app/connection')('employee_trackerDB', 'Password4SQL')

// database actions
function getAll(table) {
    const sql = `SELECT * FROM ${table};`
    return db.query(sql)
}

function getEmployeesInfo() {
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id;`
    return db.query(sql)
}
function getEmployeesByDepartment(departmentId) {
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id WHERE departments.department_id = ?;`
    return db.query(sql, [departmentId])
}

function getRoleInfo() {
    const sql = `SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id;`
    return db.query(sql)
}
function addDepartment(name) {
    const sql = `INSERT INTO departments (name) VALUES (?)`
    return db.query(sql, [name])
}

function addRole(title, salary, department_id) {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (? , ?, ?)`
    return db.query(sql, [title, salary, department_id])
}

function addEmployee(firstName, lastName, roleId, managerId) {
    if (managerId === undefined) {
        managerId = null
    }
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (? , ?, ?, ?)`
    return db.query(sql, [firstName, lastName, roleId, managerId])
}

function updateEmployee(newRole, id) {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
    return db.query(sql, [newRole, id])
}

// non-Database functions
function makeEmployeeList(dbData) {
    let employees = []
    for (let i = 0; i < dbData.length; i++) {
        let uniqueEmployee = new Employee(dbData[i].id, dbData[i].first_name, dbData[i].last_name, dbData[i].manager_id, dbData[i].title, dbData[i].salary, dbData[i].name,)
        employees.push(uniqueEmployee)
    }
    return employees
}

function makeRolesLists(dbData) {
    let roles = []
    for (let i = 0; i < dbData.length; i++) {
        let uniqueRole = new Role(dbData[i].title, dbData[i].salary, dbData[i].name)
        roles.push(uniqueRole)
    }
    return roles
}
function getDepartmentNames(dbData) {
    let departmentNames = []
    for (let i = 0; i < dbData.length; i++) {
        departmentNames.push(dbData[i].name)
    }
    return departmentNames
}

function getDepartmentDictionary(departmentData) {
    let departmentDictionary = {}
    for (let i = 0; i < departmentData.length; i++) {
        departmentDictionary[departmentData[i].name] = departmentData[i].department_id
    }
    return departmentDictionary
}

function makeDepartmentLists(dbData) {
    let departments = []
    for (let i = 0; i < dbData.length; i++) {
        let uniqueDepartment = new Department(dbData[i].name)
        departments.push(uniqueDepartment)
    }
    return departments
}

function getRoleTitles(roleData) {
    let roleTitles = []
    for (let i = 0; i < roleData.length; i++) {
        roleTitles.push(roleData[i].title)
    }
    return roleTitles
}

function getRoleDictionary(roleData) {
    let roleDictionary = {}
    for (let i = 0; i < roleData.length; i++) {
        roleDictionary[roleData[i].title] = roleData[i].role_id
    }
    return roleDictionary
}

// main function
async function main() {
    let returnedData

    let departmentData = await getAll('departments')
    let departmentNames = getDepartmentNames(departmentData)
    let departmentDictionary = getDepartmentDictionary(departmentData)

    let roleData = await getAll('roles')
    let roleTitles = getRoleTitles(roleData)
    let roleDictionary = getRoleDictionary(roleData)

    let employeeData = await getAll('employees')
    let rawEmployeeList = makeEmployeeList(employeeData)

    let employeeNames = []
    let employeeNameIdMap = {}
    for (let i = 0; i < rawEmployeeList.length; i++) {
        let name = `${rawEmployeeList[i].firstName} ${rawEmployeeList[i].lastName}`
        employeeNames.push(name)
        employeeNameIdMap[name] = rawEmployeeList[i].id
    }

    let choice = await inquirer.prompt(
        { name: "choice", message: "What would you like to do?", type: "list", choices: ["View All Employees", "View All Roles", "View All Departments", "View All Employees By Department", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Close App"] }
    )
    switch (choice.choice) {
        case "View All Employees":
            let fullEmployeeData = await getEmployeesInfo()
            console.table(makeEmployeeList(fullEmployeeData))
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
            let departments = []
            for (let i = 0; i < departmentData.length; i++) {
                choiceList.push(departmentData[i].name)
                departments.push({ id: departmentData[i].department_id, name: departmentData[i].name })
            }

            let desiredDepartment = await inquirer.prompt({ message: "Select a Department", name: "department", choices: choiceList, type: "list" })
            let departmentSearch = departments.find(dep => { return dep.name === desiredDepartment.department })

            let departmentEmployeeData = await getEmployeesByDepartment(departmentSearch.id)
            console.table(makeEmployeeList(departmentEmployeeData))
            break

        case "Add Employee":
            employeeNames.push(`No Manager`)
            let Name = await inquirer.prompt([{ name: "first_name", message: "What is the employee's first name?" }])
            let firstName = Name.first_name
            let remainingInfo = await inquirer.prompt([{ name: "last_name", message: `What is ${firstName}'s last name?` }, { name: "role", message: `What is ${firstName}'s role?`, type: "list", choices: roleTitles }, { name: "manager", message: `Who is ${firstName}'s manager?`, type: "list", choices: employeeNames }])
            if (remainingInfo.manager == "No Manager") {
                addEmployee(firstName, remainingInfo.last_name, roleDictionary[remainingInfo.role])
            } else {
                addEmployee(firstName, remainingInfo.last_name, roleDictionary[remainingInfo.role], employeeNameIdMap[remainingInfo.manager])
            }
            break
        case "Add Role":
            let roleInput = await inquirer.prompt([{ name: "department", message: "Which department is this role in?", type: "list", choices: departmentNames }, { name: "title", message: "What is the title of the new role?" }, { name: "salary", message: "What is the salary of the new role?" }])
            addRole(roleInput.title, roleInput.salary, departmentDictionary[roleInput.department])
            break
        case "Add Department":
            let departmentInput = await inquirer.prompt([{ name: "name", message: "What is the name of the new Department?" }])
            addDepartment(departmentInput.name)
            break
        case "Update Employee Role":
            let updateRoleInput = await inquirer.prompt([{ name: "employee", message: "Which employee's role would you like to update?", type: "list", choices: employeeNames }, { name: "role", message: "What should their new role be?", type: "list", choices: roleTitles }])

            updateEmployee(roleDictionary[updateRoleInput.role], employeeNameIdMap[updateRoleInput.employee])
            break
        case "Close App":
            db.close()
            return

    }

    main()
}

main()
