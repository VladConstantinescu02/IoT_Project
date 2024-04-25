import "./LivestreamPlayer.css";
import videojs from "video.js";
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

function LivestreamPlayer({ playerRef, monitoringDeviceActive, livestreamStreaming, boundingBoxRef }) {
    return ( 
        <div className="player-container" ref={playerRef}>
			{
				!monitoringDeviceActive && !livestreamStreaming ?
				<div className="player-container-alert">
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<VideocamOffIcon style={{ fontSize: "5em" }} />
						<h2 style={{ textAlign: "center" }}>Monitoring device <br /> is offline</h2>
					</div>
				</div> :
				monitoringDeviceActive && !livestreamStreaming &&
				<div className="player-container-alert">
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<div className="loader"></div>
						<h1>Loading stream...</h1>
					</div>
				</div>
			}
			<div className="bounding-box" ref={boundingBoxRef}></div>
				<video
					id="aws-live"
					playsInline
					autoPlay
					className="livestream"
				>
				</video>
        </div>
     );
}

export default LivestreamPlayer;