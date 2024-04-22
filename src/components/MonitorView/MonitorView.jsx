import "./MonitorView.css";
import React, { useEffect, useState } from "react";
import MonitorViewTop from "./MonitorViewTop/MonitorViewTop";
import MonitorViewBottom from "./MonitorViewBottom/MonitorViewBottom"; 
import axios from "axios";
import Alert from "../Alerts/Alert";

const MonitorView = () => {

    const [monitoringDeviceActive, setMonitoringDeviceActive] = useState(false);

    const [showMonitorStateAlert, setShowMonitorStateAlert] = useState(false);

    const [systemData, setSystemData] = useState({  
      systemTemperature: 0,
      //wifiName:
    });
    
    useEffect(() => {
        let webSocket = new WebSocket("ws://192.168.11.139:8080");

        webSocket.addEventListener("open", () => {
            console.log("connected to server...");

            const message = {
                ClientType: 1,
                MessageType: 1,
                Content: {
                  ApiKey: "sdfsdfbsjdhbf",
                  UserID: "124",
                  MonitoringDevicesIDs: ["123"]
                }
            }
            webSocket.send(JSON.stringify(message));
            makeRequest();
        });
        webSocket.addEventListener("message", (e) => {
            let msg = JSON.parse(e.data);

                if (msg.MessageType === 6){
                    if (msg.Type === 0) {
                            setShowMonitorStateAlert(true);
                            setMonitoringDeviceActive(true);
                    } else if (msg.Type === 1) {
                        setShowMonitorStateAlert(true);
                        setMonitoringDeviceActive(false);
                    }
                } else if(msg.MessageType === 5) {
                  setSystemData({ ...systemData, systemTemperature: msg.Content.SystemTemperature });
                }
            }
    )
    },[]);

    const makeRequest = async () => {
        try {
          const body = {
            UserID: "124",
            ApiKey: "sdfsdfbsjdhbf"
          }
          const response = await axios.post("http://192.168.11.139:8080/check/device", body, {
            headers: {
              "Content-Type": "application/json"
            }
          });
          if (response.data === "active") {
            setMonitoringDeviceActive(true);
          }
          console.log("Response:", response.data);
        } catch (error) {
          console.log("Error:", error);
        }
      }
    
    return (    
        <div className="monitor-view">
            {
                showMonitorStateAlert && 
                <Alert
                    Type={monitoringDeviceActive ? "success" : "error"}
                    msg={monitoringDeviceActive ? "Monitoring device back online" : "Monitoring device disconnected"}
                    setClose={setShowMonitorStateAlert}
                />
            }
            <div style={{ padding: "1rem 1rem .5rem 1rem " }}>
                <MonitorViewTop
                    systemData = {systemData}  
                    monitoringDeviceActive = {monitoringDeviceActive} />  
            </div>
            <div style={{ width: "100%", height: "100%", padding: "1rem"}}>
                <MonitorViewBottom />
            </div>
        </div>
    );
}

export default MonitorView;