import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AuthContext from '../auth';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    
    function showCurrentListName(){
        let text ="";
        if (store.currentList && auth.loggedIn){
            text = store.currentList.name;
        }
        return text;
    }
    
    return (
        <div id="top5-statusbar">
            <Typography variant="h4">{showCurrentListName()}</Typography>
        </div>
    );
}

export default Statusbar;