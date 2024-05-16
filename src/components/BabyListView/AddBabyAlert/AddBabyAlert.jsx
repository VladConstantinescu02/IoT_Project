import "./AddBabyAlert.css";
import Alert from "../../Alerts/Alert";
import {Button, FormControl} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {useState} from "react";
import PanoramaIcon from '@mui/icons-material/Panorama';

const AddBabyAlert = ({ setClose }) => {
    const [imageToUpload, setImageToUpload] = useState(null);

    return (
        <Alert
            msg={"Add new baby"}
            Type={"info"}
            setClose={setClose}
        >
            <FormControl>
                {
                    imageToUpload ?
                    <div
                        className={"baby-card-photo"}
                        style={{ backgroundImage: `${imageToUpload}`, margin: "0 auto" }}
                    ></div> :
                    <div
                        className={"baby-card-photo"}
                        style={{
                            backgroundColor: "#272c2b",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto",
                            marginBottom: "1rem"
                        }}
                    >
                        <PanoramaIcon sx={{ color: "whitesmoke", fontSize: "3em" }} />
                    </div>
                }
                <input style={{ display: "block" }} type={"file"} id={"imageToUpload"} />
                <label htmlFor={"imageToUpload"}>
                    <Button className={"upload-image-btn"} variant={"contained"}>Upload Image</Button>
                </label>
            </FormControl>
            <FormControl sx={{ width: "80%", marginTop: "1rem" }}>
                <TextField
                    label={"Name"}
                />
            </FormControl>
        </Alert>
    )
}

export default AddBabyAlert;