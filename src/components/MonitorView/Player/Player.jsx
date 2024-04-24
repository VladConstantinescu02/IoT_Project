import "./Player.css";
import videojs from "video.js";

const Player = () => {
    return (
        <video
			id="aws-live"
			playsInline
            autoPlay
		></video>
    );
}

export default Player;