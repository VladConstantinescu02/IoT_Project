import "./MonitorView.css";
import React from "react";
import MonitorViewTop from "./MonitorViewTop/MonitorViewTop";
import MonitorViewBottom from "./MonitorViewBottom/MonitorViewBottom"; 

const MonitorView = () => {
    return (    
        <div className="monitor-view">
            <div style={{ padding: "1rem 1rem .5rem 1rem " }}>
                <MonitorViewTop />  
            </div>
            <div style={{ width: "100%", height: "100%", padding: "1rem"}}>
                <MonitorViewBottom />
            </div>
        </div>
    );
}

export default MonitorView;