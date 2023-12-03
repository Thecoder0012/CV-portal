import React, { useState, useEffect } from "react";
import { NavigationBar } from './NavigationBar.js';
import styles from "../styles/searchSkills.module.css";

export const SearchSkills = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [personData, setPersonData] = useState([]);
  const [employeeSkillsData, setEmployeeSkillsData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [displayRows, setDisplayRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees data
        const employeesResponse = await fetch(
          "http://localhost:8080/api/employees"
        );
        const employeesData = await employeesResponse.json();
        setEmployeesData(employeesData);

        // Fetch skills data
        const skillsResponse = await fetch("http://localhost:8080/api/skills");
        const skillsData = await skillsResponse.json();
        setSkillsData(skillsData);

        // Fetch employee-skills data
        const employeeSkillsResponse = await fetch(
          "http://localhost:8080/api/employee-skills"
        );
        const employeeSkillsData = await employeeSkillsResponse.json();
        setEmployeeSkillsData(employeeSkillsData);

        // Fetch person data
        const personResponse = await fetch("http://localhost:8080/api/person");
        const personData = await personResponse.json();
        setPersonData(personData);

        // Initially, display all rows
        setDisplayRows(employeesData.map(() => true));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);

    // Update the displayRows based on the input value
    setDisplayRows((prevDisplayRows) =>
      employeesData.map((employee) => {
        const employeeSkills = employeeSkillsData.filter(
          (es) => es.employee_id === employee.employee_id
        );
        const employeeSkillNames = employeeSkills.map((es) => {
          const skill = skillsData.find((skill) => skill.id === es.skills_id);
          return skill ? skill.name.toLowerCase() : "";
        });

        // Find the corresponding person in personData
        const person = personData.find(
          (person) => person.person_id === employee.person_id
        );

        return (
          (employee.employee_id &&
            employee.employee_id.toString().includes(value)) ||
          (employee.person_id &&
            employee.person_id.toString().includes(value)) ||
          (employee.user_id && employee.user_id.toString().includes(value)) ||
          (employee.department_id &&
            employee.department_id.toString().includes(value)) ||
          (employee.project_id &&
            employee.project_id.toString().includes(value)) ||
          (person &&
            person.first_name &&
            person.first_name.toLowerCase().includes(value)) ||
          (person &&
            person.last_name &&
            person.last_name.toLowerCase().includes(value)) ||
          employeeSkillNames.some((name) => name.includes(value))
        );
      })
    );
  };

  return (
    <div className={styles.searchSkills}>
        <NavigationBar/>
      <input
        type="text"
        placeholder="Search.."
        onChange={handleInputChange}
        value={inputValue}
        className={styles.searchInput}
      />
      <table className={styles.skillsTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Employee ID</th>
            <th className={styles.tableHeader}>First Name</th>
            <th className={styles.tableHeader}>Last Name</th>
            <th className={styles.tableHeader}>Skills</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(employeesData) && employeesData.length > 0 ? (
            employeesData.map((employee, index) => (
              <tr
                key={index}
                style={{ display: displayRows[index] ? "table-row" : "none" }}
              >
                <td>{employee.employee_id}</td>
                <td>
                  {personData.find(
                    (person) => person.person_id === employee.person_id
                  )?.first_name || ""}
                </td>
                <td>
                  {personData.find(
                    (person) => person.person_id === employee.person_id
                  )?.last_name || ""}
                </td>
                <td>
                  {employeeSkillsData
                    .filter((es) => es.employee_id === employee.employee_id)
                    .map((es) => {
                      const skill = skillsData.find(
                        (skill) => skill.id === es.skills_id
                      );
                      return skill ? skill.name : "";
                    })
                    .join(", ")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No employee data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchSkills;
