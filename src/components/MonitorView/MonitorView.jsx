import "./MonitorView.css";
import React, { useEffect, useState, useRef } from "react";
import MonitorViewTop from "./MonitorViewTop/MonitorViewTop";
import MonitorViewBottom from "./MonitorViewBottom/MonitorViewBottom"; 
import axios from "axios";
import Alert from "../Alerts/Alert";
import NoStrollerIcon from '@mui/icons-material/NoStroller';
import StrollerIcon from '@mui/icons-material/Stroller';
import TemperatureData from "./MonitorViewBottom/TemperatureData/TemperatureData";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

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
      wifiName: "no_wifi"
    });

    const [temperatureData, setTemperatureData] = useState({
      temperatureC: 0,
      temperatureF: 0,
      humidity: 0
    });

    const [boundingBox, setBoundingBox] = useState(initialBoundingBoxState);

    const [livestreamStreaming, setLivestreamStreaming] = useState(JSON.parse(localStorage.getItem("livestreamStreaming")) || false);

    const playerRef = useRef(null);
    const boundingBoxRef = useRef(null);

    const [emotions, setEmotions] = useState([]);
    const [awake, setAwake] = useState(null);

    const [device, setDevice] = useState({});

    const { id } = useParams();

    const [loadingVideo, setLoadingVideo] = useState(true);
    const [loadingDevice, setLoadingDevice] = useState(true);

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const getDeviceData = async (callback) => {
        try {
          const res = await api.get( `device/${id}`);
          if (res.status === 200) {
            setDevice(res.data);
            callback(res.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
      try {
          if (loadingDevice) {
              getDeviceData(async (device) => {
                  handleWebSocketCommunication(device.id);
              }).then(r => console.log("device loaded..."));
              setLoadingDevice(false);
          }
      } catch (error) {
          console.log(error);
      }
    }, [loadingDevice])

    const handleWebSocketCommunication = (deviceId) => {
        try {
            if (!localStorage.getItem("livestreamStreaming")) localStorage.setItem("livestreamStreaming", "false");
            let webSocket = new WebSocket("ws://localhost:8080");

            webSocket.addEventListener("open", async () => {
                console.log("connected to server...");
                const message = {
                    ClientType: 1,
                    MessageType: 1,
                    Content: {
                        Email: "a@gmail.com",
                        Password: "12345678",
                        UserID: "3604f6d9-48b7-4c16-8347-e0a3bcbd99c1",
                    }
                }
                await webSocket.send(JSON.stringify(message));
                await makeConnectionRequest(deviceId);
                setSocket(webSocket);
            })
            webSocket.addEventListener("message", (e) => {
                    let msg = JSON.parse(e.data);

                    if (msg.MessageType === 6){
                        console.log(msg);
                        if (msg.Type === 0) {
                            setShowMonitorStateAlert(true);
                            setMonitoringDeviceActive(true);
                        } else if (msg.Type === 1) {
                            setShowMonitorStateAlert(true);
                            setMonitoringDeviceActive(false);
                            setEmotions([]);
                            setSystemData({
                                systemTemperature: 0,
                                wifiName: "no_wifi"
                            });

                        } else if (msg?.Type === 2 || msg?.Type === 3) {
                            console.log(msg);
                            if (msg?.Type === 2) {
                                //window.location.reload();
                                setLoadingVideo(true);
                                setLivestreamStreaming(true);
                                localStorage.setItem("livestreamStreaming", "true");
                            } else if (msg?.Type === 3) {
                                setLivestreamStreaming(false);
                                localStorage.setItem("livestreamStreaming", "false");
                            }
                        }
                    } else if(msg.MessageType === 5) {
                        setSystemData({ ...systemData, systemTemperature: msg.Content.SystemTemperature, wifiName: msg.Content.WifiName });
                    } else if(msg.MessageType ===4) {
                        setTemperatureData({
                            temperatureC: msg.Content?.TemperatureC,
                            temperatureF: msg.Content?.TemperatureF,
                            humidity: msg.Content?.Humidity
                        });
                        console.log(temperatureData);
                    } else if (msg?.MessageType === 7) {
                        if (playerRef && playerRef.current) {
                            if (msg.Content?.Emotions) {
                                setEmotions(msg.Content.Emotions);
                                setAwake(msg.Content.Awake);
                                if (msg.Content?.BoundingBox) {
                                    let left = msg.Content?.BoundingBox[0];
                                    let top = msg.Content?.BoundingBox[1];
                                    let width = msg.Content?.BoundingBox[2];
                                    let height = msg.Content?.BoundingBox[3];

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
                    }
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    const makeConnectionRequest = async (id) => {
        try {
            const body = {
                UserId: "3604f6d9-48b7-4c16-8347-e0a3bcbd99c1",
                DeviceId: id
            }
            const response = await axios.post("http://localhost:8080/check/device", body, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data === "active") {
                if (!monitoringDeviceActive)
                    setMonitoringDeviceActive(true);
            } else {
                if (monitoringDeviceActive)
                    setMonitoringDeviceActive(false);
                setBoundingBox(initialBoundingBoxState);
            }
            console.log("Response:", response.data);
        } catch (error) {
            console.log("Error:", error);
        }
    }
    
    return device && (    
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
                    monitoringDeviceActive = {monitoringDeviceActive} 
                    deviceName={device.name}
                    socket={socket}
                    deviceId={device?.id}
                />  
            </div>
            <div style={{ width: "100%", height: "88%", padding: "1rem"}}>
                <MonitorViewBottom
                  temperatureData={temperatureData}
                  emotions={emotions}
                  awake={awake}
                  boundingBox={boundingBox}
                  playerRef={playerRef}
                  boundingBoxRef={boundingBoxRef}
                  monitoringDeviceActive={monitoringDeviceActive}
                  livestreamStreaming={livestreamStreaming}
                  device={device}
                  setLoadingDevice={setLoadingDevice}
                />
            </div>
        </div>
    );
}

export default MonitorView;