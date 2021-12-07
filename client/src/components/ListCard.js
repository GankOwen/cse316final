import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from './DeleteModal';
import Icons from '../icons/'
import Top5Item from './Top5Item';
import CommentItem from './CommentItem'
import List from '@mui/material/List';
import { width } from '@mui/system';
import { Typography } from '@mui/material';
import AuthContext from '../auth';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState("");
    const { idNamePair, editActive, setEditActive } = props;
    const [open, setOpen] = useState(false);
    const [cardClick, setClickOpen] = useState(false);
    const ifAdding = props.ifAdding;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            console.log("The current: ", store.currentList)        
        }
    }

    function handleCardClick(value){
        setClickOpen(value);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }


    function handleCloseList(){
        store.updateCurrentList();
        store.closeCurrentList();
    }

    async function handlePublishClose(){
        store.publishList(idNamePair._id, idNamePair.name, idNamePair.items);
        store.closeCurrentList();
    }

    function handleKeyPress(event) {
        console.log("check current: ", store.currentList);
        if (event.code === "Enter") {
            store.currentList.name = event.target.value;
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        console.log("check1 ", event.target.value," ", store.currentList)
        setText(event.target.value);
        store.currentList.name = event.target.value;
        console.log("check1 ", event.target.value," ", store.currentList)
    }

    function handleClose (event, id){
        event.stopPropagation();
        setOpen(false);
        store.unmarkListForDeletion();
        store.setCurrentList(id);
    }

    function handleCloseConfirm(event){
        event.stopPropagation();
        setOpen(false);
        console.log("check3: ", store.markListForDeletion)
        store.deleteMarkedList();
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        
        store.markListForDeletion(id);
        //store.setCurrentList(id);
        console.log("check1: ", id)
        console.log("check2: ", store.markListForDeletion)
        setOpen(true);
    }

    function handleBlur(event){
        console.log("check1", store.currentList)
        //let id = event.target.id.substring("list-".length);
        store.currentList.name = event.target.value;
        console.log("check2", store.currentList)
        toggleEdit();
        console.log(ifAdding);
        
    }

    

    function handleNumberOfViewChange(id){
        console.log("view increase ", id)
        store.increaseViewNumber(id);
        //store.currentList.viewNumber = store.currentList.viewNumber +1;
        //store.updateCurrentList();
    }

    function handleUpdateText(event){
        idNamePair.name = event.target.value;
    }
    function handleEditList(event, id){
        store.setCurrentList(id)
        setEditActive(true);
    }
    if (store.currentList) {
        //console.log("check current",store.currentList);
        var publishedItems = 
            <div id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper', height :'50%', position : 'relative'}}>
                {
                    
                    idNamePair.items.map((item, index) => (
                        <Top5Item 
                            
                            key={'top5-item-' + (index+1) + item}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </div>;
        
        var publishedComments =
                <List id="edit-items" sx={{ width: '95%', bgcolor: 'background.paper', height : "50%", position : 'relative', bgcolor: '#5F6FD8', overflow:'scroll'}}>
                    {
                        store.currentList.comments.map((comment, index) => {

                            return <CommentItem
                                key={'top5-comment-' + (index+1) + comment}
                                comment = {comment}
                                author = {store.currentList.commentAuthors[index]}
                            />
                        })
                    }
                </List>;
    }

    let showingPart = <button
                        onClick = {(event) => 
                        {handleEditList(event, idNamePair._id)}}>edit</button>

    if(idNamePair.ifPublished){
        showingPart = <div
                        style = {{ marginTop : "5pt"}}>
                        Published: {idNamePair.date}
        </div>
    }

    if((ifAdding || editActive) && store.currentList){
        console.log("true edit")
        var addingLists = 
        <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper', height:'50%', fontSize : '15pt'}}>
            {
                store.currentList.items.map((item, index) => (
                    <Top5Item
                        key = {'top5-item-' + (index+1) +item}
                        text = {item}
                        index = {index}
                        ifAdding = {ifAdding}
                        editActive = {editActive}
                        setEditActive = {setEditActive}>
                    </Top5Item>
                ))
            }
        </List>
    }
    let displayCardColor = idNamePair.ifPublished ? '#d4d4f5' : '#fffff1'
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ display: 'flex', p: 1 , backgroundColor : displayCardColor}}
            button
            style={{
                width: '100%',
                height: 'auto',
                display : "flex",
                justifyContent : "space-between",
                border: '1px solid black'
            }}
        >
                <div 
                    style = {{display : "flex", flexDirection : "column"}}>
                    <div 
                        style = {{fontWeight: 'bold'}}>
                        {idNamePair.name}
                    </div>
                    <div
                        style = {{ marginTop : "10pt"}}>
                        By: {idNamePair.userName}
                    </div>

                    {showingPart}
                    
                </div>

                <div
                    style = {{display : "flex", flexDirection : "column", width : "50%"}}>
                    
                    <div
                        style = {{display : "flex", flexDirection : "row" }}>
                        <div
                            style = {{display : "flex", flexDirection : "row", height : '4rem', width : '4rem', marginRight : '1rem'}}>
                            <img src = {Icons.icon_like}
                                _id = {idNamePair._id}
                                style = {{ height : '48px', width : '39px'}}
                                onClick = {(event) => {
                                    event.stopPropagation();
                                    store.increaseLikeNumber(event.target.getAttribute("_id"))}}>

                            </img>
                            <div 
                                style = {{marginLeft : '5pt', marginTop : '10pt'}}>
                                {idNamePair.likeNumber}
                            </div>
                        </div>
                        

                        <div
                            style = {{display : "flex", flexDirection : "row", height : '4rem', width : '4rem'}}>
                            <img src = {Icons.icon_dislike}
                            style = {{ marginTop:'13pt', height : '48px', width : '39px', marginTop : '5px'}}
                            _id = {idNamePair._id}
                            style = {{ height : '48px', width : '39px'}}
                            onClick = {(event) => {
                                event.stopPropagation();
                                store.decreaseLikeNumber(event.target.getAttribute("_id"))}}    >
                            
                            </img>
                            <div
                                style = {{marginLeft : '5pt', marginTop : '10pt'}}>
                                {idNamePair.dislikeNumber}
                            </div>
                        </div>

                        <img src = {Icons.icon_delete}
                            style = {{ marginTop:'13pt', height : '48px', width : '39px', marginTop : '5px'}}
                            onClick = {(event)=>{handleDeleteList(event, idNamePair._id)}}>
                            
                        </img>

                        
                    </div>

                    <div
                        style = {{display : "flex", flexDirection : "row", justifyContent : "space-between"}}>
                            <div>
                                Views: {idNamePair.viewNumber}
                            </div>
                            <img src = {Icons.icon_downArrow}
                                _id = {idNamePair._id}
                                style = {{maxWidth : '10%', maxHeight : '10%'}}
                                onClick={(event) => {
                                    handleLoadList(event, idNamePair._id);
                                    handleCardClick(!cardClick);
                                    handleNumberOfViewChange(event.target.getAttribute("_id"));}
                                }>
                            </img>
                    </div>
                    
                </div>
                <DeleteModal open = {open} close = {
                    (event)=>handleClose(event,idNamePair._id)} name = {idNamePair.name} confirm = {handleCloseConfirm}/>
        </ListItem>

    
    if (cardClick) {
        cardElement = 
         <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '1rem', display: 'flex', p: 1 , border: 1, borderColor:'gray', backgroundColor: displayCardColor, fontSize : '15pt',width :"100%",
                    display:"flex",flexDirection : "row", justifyContent : "between" }}
            button
        >
                <div 
                    style = {{display : "flex", flexDirection : "column", width:"50%"}}>
                    <div 
                        style = {{fontWeight: 'bold'}}>
                        {idNamePair.name}
                    </div>
                    <div
                        style = {{ marginTop : "10pt"}}>
                        By: {idNamePair.userName}
                    </div>
                    {publishedItems}
                    {showingPart}
                </div>

                <div
                    style = {{display : "flex", flexDirection : "column",width :"50%", height : "22rem"}}>
                    
                    <div
                        style = {{display : "flex", flexDirection : "row" }}>
                        <div
                            style = {{display : "flex", flexDirection : "row", height : '4rem', width : '4rem', marginRight : '1rem'}}>
                            <img src = {Icons.icon_like}
                            style = {{ height : '48px', width : '39px'}}
                            _id = {idNamePair._id}
                            onClick = {(event) => {
                                event.stopPropagation();
                                store.increaseLikeNumber(event.target.getAttribute("_id"))}}>

                            </img>
                            <div 
                                style = {{marginLeft : '5pt', marginTop : '10pt'}}>
                                    {idNamePair.likeNumber}
                            </div>
                        </div>
                        

                        <div
                            style = {{display : "flex", flexDirection : "row", height : '4rem', width : '4rem'}}>
                            <img src = {Icons.icon_dislike}
                            style = {{ marginTop:'13pt', height : '48px', width : '39px', marginTop : '5px'}}
                            _id = {idNamePair._id}
                            onClick = {(event) => {
                                event.stopPropagation();
                                store.decreaseLikeNumber(event.target.getAttribute("_id"))}}>
                            
                            </img>
                            <div
                                style = {{marginLeft : '5pt', marginTop : '10pt'}}>
                                    {idNamePair.dislikeNumber}
                            </div>
                        </div>

                        <img src = {Icons.icon_delete}
                            style = {{ marginTop:'13pt', height : '48px', width : '39px', marginTop : '5px'}}
                            onClick = {(event)=>{handleDeleteList(event, idNamePair._id)}}>
                            
                        </img>

                        
                    </div>

                    {publishedComments}
                   
                    
                    <TextField
                            name = "comment-sent-text-field"
                            id = "comment-sent-text-field"
                            label = 'Add Comment'
                            required
                            fullWidth
                            inputProps = {{style:{fontSize:12}}}
                            onKeyPress={(event)=>{if(event.key === "Enter" && event.target.value != "") {store.publishComment(idNamePair._id, auth.user.firstName + auth.user.lastName, event.target.value);
                            event.target.value = ""}}}>

                    </TextField>
                    

                    <div
                        style = {{display : "flex", flexDirection : "row", justifyContent : "space-between"}}>
                            <div>
                                Views: {idNamePair.viewNumber}
                            </div>
                            <img src = {Icons.icon_upArrow}
                                style = {{maxWidth : '3rem', maxHeight : '3rem'}}
                                onClick={() => {
                                    setClickOpen(!cardClick);
                                    store.closeCurrentList();}}
                                >
                            </img>
                    </div>
                    
                </div>

                <DeleteModal open = {open} close = {(event)=>handleClose(event,idNamePair._id)} name = {idNamePair.name} confirm = {handleCloseConfirm}/>
                
        </ListItem>
            
    }else if(ifAdding || editActive){
        cardElement = 
        <div id = 'top5-worksapce'
            style = {{height : '40rem'}}>
            <div id = "workspace-edit"
                >
                <input id = 'top5-name-input'
                    placeholder = "Put your list name in here"
                    style = {{width : "100%"}}
                    onChange = {(event)=>setText(event.target.value)}
                    onBlur = {handleUpdateText}
                    defaultValue = {idNamePair.name}
                    ></input>
                <div
                    style = {{display : "flex", flexDirection : "row"}}>
                    <div style = {{width : '20%', height:'80%'}}>
                        <div className = 'item-number'><Typography style = {{fontSize : '27pt', marginTop : '2rem'}}>1.</Typography></div>
                        <div className = 'item-number'><Typography style = {{fontSize : '27pt', marginTop : '2rem'}}>2.</Typography></div>
                        <div className = 'item-number'><Typography style = {{fontSize : '27pt', marginTop : '2rem'}}>3.</Typography></div>
                        <div className = 'item-number'><Typography style = {{fontSize : '27pt', marginTop : '2rem'}}>4.</Typography></div>
                        <div className = 'item-number'><Typography style = {{fontSize : '27pt', marginTop : '2rem'}}>5.</Typography></div>
                    </div>
                    {addingLists}
                </div>
                <div
                    style = {{top : "90%"}}>
                <button
                    onClick = {()=>{props.setIfAdding(false)
                        setEditActive(false);
                        handleCloseList()}}>
                    Save
                </button>
                <button
                    onClick = {()=>{props.setIfAdding(false)
                        setEditActive(false)
                        handlePublishClose()}}>
                    Publish
                </button>
                </div>
                
            </div>
        </div>
    }



    return (
        cardElement
    );
}

export default ListCard;