import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Icons from '../icons/'
import BackGroundPage from './BackGroundPage';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                    
                ))
            }
            </List>;
    }
    return (
        <BackGroundPage/>       
        )
}

export default HomeScreen;