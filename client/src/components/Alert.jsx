import { useAppContext } from "../context/appContext";

const Alert = () => {
  // Importing our global state functionality
  // These are our dynamic values that will change depending on our action
  const { alertType, alertText } = useAppContext();

  // Dynamically shows depending on our state
  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
};

export default Alert;
