import "./MonitorView.css";
import React, { useEffect, useState, useRef } from "react";
import MonitorViewTop from "./MonitorViewTop/MonitorViewTop";
import MonitorViewBottom from "./MonitorViewBottom/MonitorViewBottom"; 
import axios from "axios";
import Alert from "../Alerts/Alert";
import NoStrollerIcon from '@mui/icons-material/NoStroller';
import StrollerIcon from '@mui/icons-material/Stroller';
import TemperatureData from "./MonitorViewBottom/TemperatureData/TemperatureData";
import videojs, { VideoJsPlayer } from "video.js";
import {
    registerIVSQualityPlugin,
    VideoJSQualityPlugin,
} from "amazon-ivs-player";

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

    const playerRef = useRef(null);
    const boundingBoxRef = useRef(null);

    const [emotions, setEmotions] = useState([]);

    
    useEffect(() => {
      if (!localStorage.getItem("livestreamStreaming")) localStorage.setItem("livestreamStreaming", "false");
        let webSocket = new WebSocket("ws://localhost:8080");

        webSocket.addEventListener("open", () => {
            console.log("connected to server...");

            const message = {
                ClientType: 1,
                MessageType: 1,
                Content: {
                    Email: "a@gmail.com",
                    Password: "12345678",
                    UserID: "3604F6D9-48B7-4C16-8347-E0A3BCBD99C1",
                }
            }
            webSocket.send(JSON.stringify(message));
            makeConnectionRequest();
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
                  if (playerRef && playerRef.current) {
                    if (msg.Content?.Emotions) {
                      setEmotions(msg.Content.Emotions);
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
                }
            }
        )
    }, []);

    const makeConnectionRequest = async () => {
        try {
            const body = {
                ApiKey: "kdjcnksdjnc",
                UserID: "3604F6D9-48B7-4C16-8347-E0A3BCBD99C1",
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

    const rtmpURL =
        "https://0679413b8dc3.us-east-1.playback.live-video.net/api/video/v1/us-east-1.637423178803.channel.AY8bo8hMFPfv.m3u8";

    useEffect(() => {
        const mediaPlayerScript = document.createElement("script");

        mediaPlayerScript.src =
            "https://player.live-video.net/1.3.1/amazon-ivs-videojs-tech.min.js";
        mediaPlayerScript.async = false;
        mediaPlayerScript.onload = () => {
            mediaPlayerScriptLoaded();
        };

        document.body.appendChild(mediaPlayerScript);
    }, []);

    const mediaPlayerScriptLoaded = () => {
        const registerIVSTech = window.registerIVSTech;
        registerIVSTech(videojs);
        registerIVSQualityPlugin(videojs);

        var player = videojs(
            "aws-live",
            {
                techOrder: ["AmazonIVS"],
            },
            () => {
                console.log("Player is ready to use!");

                const videoContainerEl = document.querySelector("#aws-live");

                player.enableIVSQualityPlugin();
                player.volume(0.5);
                player.src(rtmpURL);
            }
        )
    };
    
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
            <div style={{ width: "100%", height: "88%", padding: "1rem"}}>
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