import "./MonitorViewBottom.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Height } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const MonitorViewBottom = () => {   

    return (
        <div className="monitor-view-bottom">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={7}>
                    <Item style ={{ height: "35rem" }} >

                    </Item>
                    <Item style ={{ height: "10rem", marginTop: "1rem" }}>

                    </Item>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Item style ={{ height: "30rem" }}>

                    </Item>
                    <Item style ={{ height: "15rem", marginTop: "1rem" }}>

                    </Item>
                </Grid>
            </Grid>
        </div>
    );

}

export default MonitorViewBottom;