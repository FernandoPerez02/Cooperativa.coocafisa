import "@public/styles/alert.css";

const AlertPopup = ({ message, type}) => {
  return (
    <div className={`alert-popup ${type}`}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
      </div>
    </div>
  );
};

export default AlertPopup;
