import "./MonitorViewTop.css";
import React from "react";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WifiIcon from '@mui/icons-material/Wifi';
import { Button } from "@mui/material";
import { useState } from "react";

const MonitorViewTop = ({monitoringDeviceActive, systemData}) => {
    
    const [dropdownOpen, setDropDownOpen] = useState(false);

    const toggleDropdownOpen = () => {
        setDropDownOpen(!dropdownOpen);
    }

    
    return(
        <div className="monitor-view-top">
            <div className="monitor-view-top-left">
                <h2 className="monitor-view-top-title">Living room monitor</h2>
                <div className="monitor-status">
                    {
                        monitoringDeviceActive ? "Online" : "Offline"
                    }
                    <WifiIcon style={{ marginBottom: '-5px' }} />
                </div>
            </div>
            <div className="monitor-view-top-right">
                <h2 className="system-temperature-display">{systemData.systemTemperature} <DeviceThermostatIcon style={{ marginBottom: '-5px' }}/></h2>
                <div className="wifi-dropdown">
                    <Button variant="contained" onClick={toggleDropdownOpen} style = {{ backgroundColor: "#272c2b", color: "#eb5e92" }}>
                        Wifiname
                        <KeyboardArrowDownIcon />
                    </Button>
                    {
                        dropdownOpen && 
                        <div className="dropdown-content">

                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default MonitorViewTop;