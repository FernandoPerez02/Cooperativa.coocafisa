import "@public/styles/alert.css";

const AlertPopup = ({ children, message, type }) => {
  return (
    <div className={`alert-popup ${type}`}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        {children}
      </div>
    </div>
  );
};

export default AlertPopup;
