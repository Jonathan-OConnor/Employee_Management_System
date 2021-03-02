USE employee_trackerDB;

INSERT INTO departments (name) VALUES ("FirstDepartment");
INSERT INTO departments (name) VALUES ("SecondDepartment");
INSERT INTO roles (title, salary, department_id) VALUES("FirstRole", 2.0, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("SecondRole", 2.0, 1);
INSERT INTO employees (first_name, last_name, role_id) VALUES ("First", "Last", 1);


