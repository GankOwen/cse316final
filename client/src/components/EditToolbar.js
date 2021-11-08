import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }
    function ifHaveUndo(){
        return store.canUndo();
    }
    function ifHaveRedo(){
        return store.canRedo();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    

    

    

    return (
        <div id="edit-toolbar">
            {ifHaveUndo() ? 
            <Button 
                id='undo-button'
                onClick={handleUndo}
                variant="contained"
                className = {store.isItemEditActive ?  "top5-button-disabled" : "top5-button"}>
                    <UndoIcon />
            </Button>
            :
            <Button 
                id='undo-button'
                onClick={handleUndo}
                variant="contained"
                className = "top5-button-disabled">
                    <UndoIcon />
            </Button>}
            
            {ifHaveRedo() ? 
            <Button 
                id='redo-button'
                onClick={handleRedo}
                variant="contained"
                className = {store.isItemEditActive ? "top5-button-disabled" : "top5-button"}>
                    <RedoIcon />
            </Button>
            :
            <Button 
                id='redo-button'
                onClick={handleRedo}
                variant="contained"
                className = "top5-button-disabled">
                    <RedoIcon />
            </Button>}

            <Button 
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className = {store.isItemEditActive ?  "top5-button-disabled" : "top5-button"}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;