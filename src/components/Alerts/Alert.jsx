import "./Alert.css";
import CloseIcon from '@mui/icons-material/Close';


const Alert = ({ Type, msg, setClose, children}) => {
    return (
    <div className="alert-container">
        <div className="alert" style={{ backgroundColor: Type === "success" ? "#269f67" : "#c8224d" }}>
            <div className="close-icon" onClick={ () => setClose(false) }>
                <CloseIcon />
            </div>
            <h2>
                {msg}
            </h2>
            {
                    children
            }
        </div>
    </div>
    );
}

export default Alert;