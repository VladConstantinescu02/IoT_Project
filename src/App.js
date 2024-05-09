import { useState, useEffect } from "react";
import MonitorView from "./components/MonitorView/MonitorView";
import "./App.css";
import videojs, { VideoJsPlayer } from "video.js";
import {
	registerIVSQualityPlugin,
	VideoJSQualityPlugin,
} from "amazon-ivs-player";

function App() {
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
    <>
          <div>
			  <MonitorView />
          </div>
    </>
  )
}

export default App