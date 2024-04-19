import "./Alert.css";
import CloseIcon from '@mui/icons-material/Close';

const Alert = ({ Type, msg, setClose }) => {
    return (
    <div className="alert-container">
        <div className="alert" style={{ backgroundColor: Type === "success" ? "green" : "red" }}>
            <div className="close-icon" onClick={ () => setClose(false) }>
                <CloseIcon />
            </div>
            <h2>
                {msg}
            </h2>
        </div>
    </div>
    );
}

export default Alert;