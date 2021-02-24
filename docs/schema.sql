CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE departments(
    department_id INT,
    name VARCHAR(30),
    PRIMARY KEY (department_id)
);

CREATE TABLE roles(
    role_id INT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE employees(
    id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);