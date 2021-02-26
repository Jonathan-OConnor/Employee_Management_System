class Department{
    constructor(name){
        this.name = name
    }
}
class Role {
    constructor(title, salary, departmentName){
        this.title = title
        this.salary = salary
        this.departmentName = departmentName
    }
}

class Employee {
    constructor(id, firstName, lastName, manager, title, salary, departmentName){
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.title = title
        if (manager === null){
            this.manager = "No Manager"
        } else {
           this.manager = manager 
        }
        this.salary = salary
        this.department = departmentName
    }
}

module.exports = {Department, Role, Employee}