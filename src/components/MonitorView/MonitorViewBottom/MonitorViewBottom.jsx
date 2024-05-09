import "./MonitorViewBottom.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Height } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import TemperatureData from "./TemperatureData/TemperatureData";
import LivestreamPlayer from "./LivestreamPlayer/LivestreamPlayer";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    borderRadius: "10px",
    color: theme.palette.text.secondary,
  }));

const MonitorViewBottom = ({ temperatureData, emotions, boundingBox, playerRef, boundingBoxRef, monitoringDeviceActive, livestreamStreaming }) => {   
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className="monitor-view-bottom">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ height: "90%" }}>
                <Grid item xs={12} sm={7}>
                    <Item style={{ height: isSmallScreen ? "60vh" : "90%", backgroundColor: "transparent", boxShadow: "none" }} >
                        <LivestreamPlayer
                            boundingBox={boundingBox}
                            playerRef={playerRef}
                            boundingBoxRef={boundingBoxRef}
                            monitoringDeviceActive={monitoringDeviceActive}
                            livestreamStreaming={livestreamStreaming}
                         />
                    </Item>
                    <Item style={{ marginTop: "1rem", height: isSmallScreen ? "22vh" : "29%", backgroundColor: "transparent", boxShadow: "none" }}>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Item style={{ height: isSmallScreen ? "20rem" : "80%", backgroundColor: "transparent", boxShadow: "none" }}>

                    </Item>
                    <Item style ={{ marginTop: "1rem", height: "39%", backgroundColor: "transparent", boxShadow: "none" }}>
                        <TemperatureData 
                            temperatureData={temperatureData}
                        />
                    </Item>
                </Grid>
            </Grid>
        </div>
    );

}

export default MonitorViewBottom;