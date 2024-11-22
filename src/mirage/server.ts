import { createServer, Model, Response } from "miragejs";

interface EmployeeAttrs {
  name: string;
  position: string;
  department: string;
}

export function makeServer() {
  return createServer({
    // Define the model for Employee
    models: {
      employee: Model.extend<EmployeeAttrs>({}),
    },

    // Seed initial data
    seeds(server) {
      server.create('employee', { id: '1', name: 'John Doe', position: 'Software Engineer', department: 'IT' });
      server.create('employee', { id: '2', name: 'Jane Smith', position: 'Product Manager', department: 'Product' });
      server.create('employee', { id: '3', name: 'Alice Johnson', position: 'UX Designer', department: 'Design' });
      server.create('employee', { id: '4', name: 'Robert Brown', position: 'QA Engineer', department: 'Quality' });
      server.create('employee', { id: '5', name: 'Emily Davis', position: 'Data Scientist', department: 'Data' });
      server.create('employee', { id: '6', name: 'Michael Wilson', position: 'HR Manager', department: 'HR' });
      server.create('employee', { id: '7', name: 'Sarah Taylor', position: 'Marketing Specialist', department: 'Marketing' });
      server.create('employee', { id: '8', name: 'Chris Evans', position: 'DevOps Engineer', department: 'Operations' });
      server.create('employee', { id: '9', name: 'Sophia Moore', position: 'Frontend Developer', department: 'Development' });
      server.create('employee', { id: '10', name: 'Daniel Clark', position: 'Backend Developer', department: 'Development' });
    },

    // Define routes
    routes() {
      this.namespace = "api"; 

      // Get all employees
      this.get("/employees", (schema) => {
        return schema.all("employee");
      });

      // Get a single employee by ID
      this.get("/employees/:id", (schema, request) => {
        const id = request.params.id;
        return schema.find("employee", id);
      });

      // Create a new employee
      this.post("/employees", (schema, request) => {
        console.log("test", request);
        const attrs: any = JSON.parse(request.requestBody); 
        return schema.create("employee", attrs); 
      });

      // Update an existing employee (using PATCH)
      this.patch("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const attrs: Partial<EmployeeAttrs> = JSON.parse(request.requestBody);

        const employee = schema.find("employee", id); 

        if (employee) {
          employee.update(attrs);
          return employee; 
        }

        return new Response(404, {}, { error: "Employee not found" });
      });

      // Delete an employee
      this.delete("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const employee = schema.find("employee", id); 

        if (employee) {
          employee.destroy(); 
          return new Response(204); 
        }

        return new Response(404, {}, { error: "Employee not found" });
      });
    },
  });
}
