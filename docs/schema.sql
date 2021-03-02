CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE departments(
    name VARCHAR(30),
    department_id INT AUTO_INCREMENT,
    PRIMARY KEY (department_id)
);

CREATE TABLE roles(
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    role_id INT AUTO_INCREMENT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE employees(
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    id INT AUTO_INCREMENT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);