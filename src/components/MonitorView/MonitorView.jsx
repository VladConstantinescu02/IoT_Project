import "./MonitorView.css";
import React, { useEffect, useState, useRef } from "react";
import MonitorViewTop from "./MonitorViewTop/MonitorViewTop";
import MonitorViewBottom from "./MonitorViewBottom/MonitorViewBottom"; 
import axios from "axios";
import Alert from "../Alerts/Alert";
import NoStrollerIcon from '@mui/icons-material/NoStroller';
import StrollerIcon from '@mui/icons-material/Stroller';
import TemperatureData from "./MonitorViewBottom/TemperatureData/TemperatureData";

const initialBoundingBoxState = {
  Left: 0,
  Top: 0,
  Width: 0,
  Height: 0
}

const MonitorView = () => {

    const [monitoringDeviceActive, setMonitoringDeviceActive] = useState(false);

    const [showMonitorStateAlert, setShowMonitorStateAlert] = useState(false);

    const [systemData, setSystemData] = useState({  
      systemTemperature: 0,
      //wifiName:
    });

    const [temperatureData, setTemperatureData] = useState({
      temperatureC: 0,
      temperatureF: 0,
      humidity: 0
    });

    const [boundingBox, setBoundingBox] = useState(initialBoundingBoxState);

    const [livestreamStreaming, setLivestreamStreaming] = useState(JSON.parse(localStorage.getItem("livestreamStreaming")) || false);

    const [showMonitorViewStateAlert, setShowMonitorViewStateAlert] = useState(false);

    const playerRef = useRef(null);
    const boundingBoxRef = useRef(null);

    const [emotions, setEmotions] = useState([]);

    
    useEffect(() => {
      if (!localStorage.getItem("livestreamStreaming")) localStorage.setItem("livestreamStreaming", "false");
        let webSocket = new WebSocket("ws://192.168.128.139:8080");

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
                    } else if (msg?.Type === 2 || msg?.Type === 3) {
                      console.log(msg);
                        if (msg?.Type === 2) {
                          window.location.reload();
                          setLivestreamStreaming(true);
                          localStorage.setItem("livestreamStreaming", "true");
                        } else if (msg?.Type === 3) {
                          setLivestreamStreaming(false);
                          localStorage.setItem("livestreamStreaming", "false");
                        }
                    }
                } else if(msg.MessageType === 5) {
                  setSystemData({ ...systemData, systemTemperature: msg.Content.SystemTemperature });
                } else if(msg.MessageType ===4) {
                  setTemperatureData({
                    temperatureC: msg.Content.TemperatureC,
                    temperatureF: msg.Content.TemperatureF,
                    humidity: msg.Content.Humidity
                  });
                  console.log(temperatureData);
                } else if (msg?.MessageType === 7) {
                  if (msg.Content?.Emotions) {
                    setEmotions(msg.Content.Emotions);
                  }

                  if (msg.Content?.BoundingBox) {
                    let left = msg.Content?.BoundingBox[0];
                    let top = msg.Content?.BoundingBox[1];
                    let width = msg.Content?.BoundingBox[2];
                    let height = msg.Content?.BoundingBox[3];
                    console.log("da");

                    let playerWidth = playerRef.current.clientWidth;
                    let playerHeight = playerRef.current.clientHeight;

                    console.log(playerRef);
                    console.log(playerWidth, playerHeight);

                    console.log(playerWidth * left, playerHeight * top, playerWidth * width, playerHeight * height);

                    boundingBoxRef.current.style.left = `${playerWidth * left * 1.0}px`;
                    boundingBoxRef.current.style.top = `${playerHeight * top * 1.0}px`;
                    boundingBoxRef.current.style.width = `${playerWidth * width * 1.0}px`;
                    boundingBoxRef.current.style.height = `${playerHeight * height * 1.0}px`;

                    setBoundingBox({
                      Left: left,
                      Top: top,
                      Width: width,
                      Height: height
                    })
                  }
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
          const response = await axios.post("http://192.168.128.139:8080/check/device", body, {
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
                    monitoringDeviceActive={monitoringDeviceActive}
                >
                  {
                    monitoringDeviceActive ?
                    <StrollerIcon  style={{fontSize: "3em"}}/> :
                    <NoStrollerIcon  style={{fontSize: "3em"}}/>
                  }
                  </ Alert>
            }
            <div style={{ padding: "1rem 1rem .5rem 1rem " }}>
                <MonitorViewTop
                    systemData = {systemData}  
                    monitoringDeviceActive = {monitoringDeviceActive} />  
            </div>
            <div style={{ width: "100%", height: "87%", padding: "1rem"}}>
                <MonitorViewBottom
                  temperatureData={temperatureData}
                  emotions={emotions}
                  boundingBox={boundingBox}
                  playerRef={playerRef}
                  boundingBoxRef={boundingBoxRef}
                  monitoringDeviceActive={monitoringDeviceActive}
                  livestreamStreaming={livestreamStreaming}
                />
            </div>
        </div>
    );
}

export default MonitorView;