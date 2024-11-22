import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";

// Define the Employee type
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    name: "",
    position: "",
    department: "",
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Base API URL
  const API_URL = "/api/employees";

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setEmployees(response.data.employees); // Assuming API returns { employees: [] }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Create a new employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const employeeWithId: Employee = {
      ...newEmployee,
      id: Date.now().toString(), // Generate unique ID
    };

    try {
      const response = await axios.post(`${API_URL}`, employeeWithId);
      setEmployees([...employees, response.data]);
      setNewEmployee({ name: "", position: "", department: "" }); // Reset form
    } catch (error) {
      console.error("Error creating employee:", error);
    }
    fetchEmployees();
  };

  // Update an employee
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    try {
      const response = await axios.patch(
        `${API_URL}/${editingEmployee.id}`,
        editingEmployee
      );
      setEmployees(
        employees.map((emp) =>
          emp.id === response.data.id ? response.data : emp
        )
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
    fetchEmployees();
  };

  // Delete an employee
  const handleDeleteEmployee = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "new" | "edit"
  ) => {
    const { name, value } = e.target;

    if (mode === "new") {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    } else if (mode === "edit" && editingEmployee) {
      setEditingEmployee((prev) => ({ ...prev!, [name]: value }));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Container  className="">

      <Card className="p-4 shadow-lg card">
        <Form
          onSubmit={
            editingEmployee ? handleUpdateEmployee : handleCreateEmployee
          }
        >
          <h2 className="text-center mb-4">
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter employee's name"
                  value={
                    editingEmployee ? editingEmployee.name : newEmployee.name
                  }
                  onChange={(e:any) =>
                    handleChange(e, editingEmployee ? "edit" : "new")
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formPosition">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  placeholder="Enter position"
                  value={
                    editingEmployee
                      ? editingEmployee.position
                      : newEmployee.position
                  }
                  onChange={(e: any) =>
                    handleChange(e, editingEmployee ? "edit" : "new")
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  placeholder="Enter department"
                  value={
                    editingEmployee
                      ? editingEmployee.department
                      : newEmployee.department
                  }
                  onChange={(e: any) =>
                    handleChange(e, editingEmployee ? "edit" : "new")
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="primary" type="submit">
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </Form>
      </Card>
      <h1 className="mb-4 text-center">Employee List</h1>

      <Table striped bordered hover className="mt-4 w-100">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Position</th>
            <th className="px-4 py-2 text-center">Department</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteEmployee(emp.id)}
                  className="me-2"
                >
                  Delete
                </Button>
                <Button
                  variant="warning"
                  onClick={() => setEditingEmployee(emp)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EmployeeList;
