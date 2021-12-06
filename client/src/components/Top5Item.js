import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const editActive = props.editActive;
    const setEditActive = props.setEditActive;
    const [draggedTo, setDraggedTo] = useState(0);
    const [text, setText] = useState(props.text);

    const ifAdding = props.ifAdding;

    function handleDragStart(event, targetId) {
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function toggleEdit(){
        let newActive = !editActive;
        if(newActive){
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleToggleEdit(event){
        event.stopPropagation();
        toggleEdit();
    }

    function handleKeyPress(event){
        if(event.code === "Enter"){
            store.addUpdateItemTransaction(index, event.target.value);
            toggleEdit();
        }
        setText(event.target.value);
    }

    function handleBlur(event){
        store.addUpdateItemTransaction(index, event.target.value);
        toggleEdit();
        setText(event.target.value);
    }

    function handleItemChange(event){
        store.currentList.items[props.index] = event.target.value;
        setText(event.target.value);
    }

    let { index } = props;


    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let returnItem = null;
        returnItem = 
        <div
            id={'item-' + (index+1)}
            className={itemClass}
            sx={{ display: 'flex', p: 1 }}
            style={{
                fontSize: '24pt',
                width: '100%'
            }}
        >
                <Box sx={{ p: 1, flexGrow: 1 }}
                        >{index+1}. {props.text}</Box>
        </div>

        if(ifAdding || editActive){
            returnItem = 
            <TextField
                margin="normal"
                required
                fullWidth
                id={"item-" + (index+1)}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleItemChange}
                onBlur = {handleItemChange}
                onChange={(event)=>setText(event.target.value)}
                defaultValue={text}
                inputProps={{style: {fontSize: 20}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
        }
    
    

    return (
        returnItem
    )
}

export default Top5Item;