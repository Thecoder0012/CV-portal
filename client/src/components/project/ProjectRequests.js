import styles from "../../styles/project/assignment.module.css";

export const ProjectRequests = ({ requestedProjects, rejectRequest, fetchProjectRequests }) => {
    fetchProjectRequests();

  return (
    <div
      className={`${styles.messageBox} ${
        requestedProjects.length > 0 ? styles.show : ""
      }`}
    >
      <h3>Project Requests</h3>
      {requestedProjects.map((request) => (
        <div key={request.request_id}>
          <p>
          {`${request.first_name} ${request.last_name} (Employee ID: ${request.employee_id}) 
          has requested to be assigned to "${request.title}".`}
          </p>
          <div>
          <button
            onClick={() => rejectRequest(request.request_id)}
            className={styles.rejectButton}
          >
            Reject Request
          </button>

        </div>
        </div>
      ))}
    </div>
  );
};
