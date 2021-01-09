import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WeatherContext } from './main';

const Dia = () => {

    const { open, setOpen } = useContext(WeatherContext);

    return(
        <Dialog open={open} >
            <DialogTitle>ALERT</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Invalid City Name
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button onClick={()=>setOpen(false)}>Close</button>
            </DialogActions>
        </Dialog>
    );

}

export default Dia;