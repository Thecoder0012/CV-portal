import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  const styles = {
    notFoundContainer: {
      textAlign: "center",
      marginTop: "50px",
    },
    title: {
      color: "#ff0000",
      fontSize: "24px",
    },
    message: {
      fontSize: "16px",
      marginBottom: "20px",
    },
    goBackButton: {
      backgroundColor: "#4caf50", 
      color: "#ffffff", 
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      border: "none",
      borderRadius: "5px",
    },
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <div style={styles.notFoundContainer}>
      <h2 style={styles.title}>404 - Not Found</h2>
      <p style={styles.message}>
        Sorry, the page you are looking for does not exist.
      </p>
      <button style={styles.goBackButton} onClick={previousPage}>
        Go Back
      </button>
    </div>
  );
};
