import React, { useState, useEffect } from "react";
import { NavigationBar } from "./NavigationBar.js";
import styles from "../styles/searchSkills.module.css";
import axios from "axios";
import EmployeeDetails from "./EmployeeDetails.js";
import { API_URL } from "../config/apiUrl.js";

export const SearchSkills = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [personData, setPersonData] = useState([]);
  const [employeeSkillsData, setEmployeeSkillsData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [SelectedPersonId, setSelectedPersonId] = useState(null);

  const handleRowClick = (person_id) => {
    setSelectedPersonId(person_id);
  };

  const closePopup = () => {
    setSelectedPersonId(null);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await axios.get(
                    API_URL + "/api/employees"
        );

        setEmployeesData(employeesResponse.data.employees);

        const skillsResponse = await axios.get(
          API_URL + "/api/skills"
        );
        setSkillsData(skillsResponse.data.skills);

        const employeeSkillsResponse = await axios.get(
          API_URL + "/api/employee-skills"
        );
        setEmployeeSkillsData(employeeSkillsResponse.data.employeeSkills);

        const personResponse = await axios.get(
          API_URL + "/api/person"
        );
        setPersonData(personResponse.data.person);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    setCurrentPage(1);
  };

  const filteredRows = employeesData.filter((employee) => {
    const employeeSkills = employeeSkillsData.filter(
      (es) => es.employee_id === employee.employee_id
    );
    const employeeSkillNames = employeeSkills.map((es) => {
      const skill = skillsData.find((skill) => skill.id === es.skills_id);
      return skill ? skill.name.toLowerCase() : "";
    });

    const person = personData.find(
      (person) => person.person_id === employee.person_id
    );



    return (
      (employee.employee_id &&
        employee.employee_id.toString().includes(inputValue)) ||
      (employee.person_id &&
        employee.person_id.toString().includes(inputValue)) ||
      (employee.user_id && employee.user_id.toString().includes(inputValue)) ||
      (employee.department_id &&
        employee.department_id.toString().includes(inputValue)) ||
      (employee.project_id &&
        employee.project_id.toString().includes(inputValue)) ||
      (person &&
        person.first_name &&
        person.first_name.toLowerCase().includes(inputValue)) ||
      (person &&
        person.last_name &&
        person.last_name.toLowerCase().includes(inputValue)) ||
      employeeSkillNames.some((name) => name.includes(inputValue))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisplayRows = filteredRows.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.searchSkills}>
      <NavigationBar />
      <h1 className={styles.header}>Find Employee</h1>
      <div className={styles.tableContainer}>
      <input
        type="text"
        placeholder="Search for a name or a skill.."
        onChange={handleInputChange}
        value={inputValue}
        className={styles.searchInput}
      />
        <table className={styles.skillsTable}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.tableHeader}>ID</th>
              <th className={styles.tableHeader}>First Name</th>
              <th className={styles.tableHeader}>Last Name</th>
              <th className={styles.tableHeader}>Skills</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentDisplayRows) &&
            currentDisplayRows.length > 0 ? (
              currentDisplayRows.map((employee, index) => (
                <tr
                  key={index}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(employee.person_id)}
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
                      .map((es, skillIndex) => (
                        <span key={skillIndex} className={styles.skill}>
                          {
                            skillsData.find(
                              (skill) => skill.id === es.skills_id
                            )?.name
                          }
                        </span>
                      ))}
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
      <div className={styles.pagination}>
        {Array.from({
          length: Math.ceil(filteredRows.length / itemsPerPage),
        }).map((_, index) => (
          <button
            className={index + 1 === currentPage ? styles.active : ""}
            key={index}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))} 
      </div>
      {SelectedPersonId && (
        <EmployeeDetails onClose={closePopup} id={SelectedPersonId} />
      )}
    </div>
  );
};

export default SearchSkills;
