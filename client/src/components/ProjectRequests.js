import styles from "../styles/assignment.module.css";

export const ProjectRequests = ({ requestedProjects, rejectRequest, fetchProjectRequests }) => {
    fetchProjectRequests();
  return (
    <div
      className={`${styles.messageBox} ${
        requestedProjects.length > 0 ? styles.show : ""
      }`}
    >
      <h3>Project requests from developers</h3>
      {requestedProjects.map((request) => (
        <div key={request.request_id}>
          <p>
            {`Employee: ${request.employee_id} ${request.first_name} ${request.last_name} wants to be assigned to ${request.title}.`}
          </p>
          <button
            onClick={() => rejectRequest(request.request_id)}
            className={styles.rejectButton}
          >
            Reject Request
          </button>
        </div>
      ))}
    </div>
  );
};
