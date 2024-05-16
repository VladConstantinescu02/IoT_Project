import "./BabyCard.css";
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import * as React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import Moment from "react-moment";
const BabyCard = ({ babyId, babyName, babyPhoto, babyBirthDate }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={"baby-card"}>
            {
                babyPhoto ?
                <div
                    className={"baby-card-photo"}
                    style={{ backgroundImage: `url("http://localhost:6060/image/${babyPhoto}")` }}
                ></div> :
                <div
                    className={"baby-card-photo"}
                    style={{ backgroundImage: "url(https://i.pinimg.com/564x/74/42/9c/74429c9d0c57594d11c01b4747e2ca94.jpg)" }}
                ></div>
            }
            <div className={"baby-card-info"} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "1rem", marginBottom: "-.3rem" }}>
                    <BabyChangingStationIcon sx={{ fontSize: "2em" }} />
                </div>
                <div>
                    <div>
                        {babyName}
                    </div>
                    <div className={"baby-card-info-age"}>
                        <Moment fromNow date={babyBirthDate} />
                        {" was born"}
                    </div>
                </div>
            </div>
            <div>
                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>Delete <DeleteIcon /></MenuItem>
                    <MenuItem>Edit<EditIcon /></MenuItem>
                </Menu>
            </div>
        </div>
    )
}

export default BabyCard;