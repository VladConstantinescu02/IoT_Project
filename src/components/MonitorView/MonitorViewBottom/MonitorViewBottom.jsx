import "./MonitorViewBottom.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Height } from "@mui/icons-material";
import Player from "../Player/Player";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: "10px",
    color: theme.palette.text.secondary,
  }));

const MonitorViewBottom = () => {   
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className="monitor-view-bottom">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ height: "100%" }}>
                <Grid item xs={12} sm={7}>
                    <Item style ={{ height: isSmallScreen ? "60vh" : "70%" }} >
                        <Player />
                    </Item>
                    <Item style ={{ marginTop: "1rem", height: isSmallScreen ? "22vh" : "29%" }}>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Item style ={{ height: isSmallScreen ? "20rem" : "59%", marginTop: ".5rem" }}>

                    </Item>
                    <Item style ={{ marginTop: "1rem", height: "39%" }}>

                    </Item>
                </Grid>
            </Grid>
        </div>
    );

}

export default MonitorViewBottom;