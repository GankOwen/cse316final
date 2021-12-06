import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Fab, Menu, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Icons from '../icons/'
import ListCard from './ListCard';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import IconButton  from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';

export default function BackGroundPage(){
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const ifMenuOpen = Boolean(anchorEl);

    const [ifAdding, setIfAdding] = useState(false);

    useEffect(() => {
         store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
        setIfAdding(true);
    }

    const handleProfileMenuOpen = (event) =>{
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () =>{
        setAnchorEl(null);
    }

    const handleSortByLastest = () => {
        handleMenuClose()
    }
    const handleSortByOldest = () => {
        handleMenuClose()
    }

    const handleSortByView = () => {
        handleMenuClose()
    }
    const handleSortByLike = () => {
        handleMenuClose()
    }
    const handleSortByDislike = () => {
        handleMenuClose()
    }

    const menuId = 'sort-list-menu';

    const SortMenu = (
        <Menu
            id = {menuId}
            anchorEl = {anchorEl}
            open = {ifMenuOpen}
            onClose ={handleMenuClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            transformOrigin = {{
                vertical : 'top',
                horizontal: 'right'
            }}>
                <MenuItem onClick = {handleMenuClose}> Publish Date(Newest)</MenuItem>
                <MenuItem onClick = {handleMenuClose}> Publish Date(Oldest)</MenuItem>
                <MenuItem onClick = {handleMenuClose}> Views</MenuItem>
                <MenuItem onClick = {handleMenuClose}> Likes</MenuItem>
                <MenuItem onClick = {handleMenuClose}> Dislikes</MenuItem>

        </Menu>
    );



    var lists = "";
    if(store){
        if(ifAdding && store.currentList){
            lists = 
            <List sx = {{width: '90%', left: '5%', bgcolor: 'background.paper'}}>
                {
                    
                    <ListCard
                        key={store.currentList._id}
                        idNamePair = {store.currentList}
                        setIfAdding = {setIfAdding}
                        ifAdding = {ifAdding}
                    />
                    
                }
            </List>
        }else{
            lists = 
                <List sx = {{width: '90%', left: '5%', bgcolor: 'background.paper'}}>
                    {
                        store.idNamePairs.map((pair) =>(
                            <ListCard
                                key={pair._id}
                                idNamePair = {pair}
                                setIfAdding = {setIfAdding}
                                ifAdding = {ifAdding}
                            />
                        ))
                    }
                </List>
        }
    }


    return (
        <div id = "top5-list-selector">
                    <div id = "list-selector-heading"
                        style = {{position : 'relative'}}>
                        <div id = "top5-list-topbar"
                            style = {{position : 'absolute', top : '0'}}>
                            <img src = {Icons.icon_home}
                                style = {{width : "5%",height : "100%", marginLeft:"1%"}}
                                >
                            
                            </img>

                            <img src = {Icons.icon_group}
                                style = {{width : "5%",height : "100%", marginLeft:"1%"}}
                                >
                            
                            </img>

                            <img src = {Icons.icon_user}
                                style = {{width : "5%",height : "100%", marginLeft:"1%"}}
                                >
                            
                            </img>

                            <img src = {Icons.icon_community}
                                style = {{width : "5%",height : "100%", marginLeft:"1%"}}
                                >
                            
                            </img>
                            <input style = {{width:"35%", height : "100%", marginLeft: "10%"}}
                                id = "top5_lister_search_bar"
                                type = "text"
                                placeholder = "Search in here">
                            
                            </input>

                            <div
                                style = {{width : "20%",height : "100%", marginRight:"1%"}}
                            >
                                SORT BY
                            </div>

                            <IconButton
                                size = "large"
                                edge = 'end'
                                aria-label = "sort for lists"
                                aria-controls = {menuId}
                                aria-haspopup = "true"
                                onClick = {handleProfileMenuOpen}
                                color = "inherit"
                                style = {{width : '5%', height : "100%", marginRight : "-10%"}}>
                                    <SortIcon style = {{width:"150%", height : "150%"}}/>

                            </IconButton>
                            {SortMenu}

                        </div>

                    </div>
                    <div id = "list-selector-list"
                        style =  {{height : '75%'}}>
                        {lists}
                    </div>
                    <div 
                        style = {{position : "absolute", bottom : '20px', width : '100%', display : 'flex', justifyContent : 'center'}}>
                        <Fab 
                            color="primary" 
                            aria-label="add"
                            id="add-list-button"
                            onClick={handleCreateNewList}   
                        >
                            <AddIcon />
                        </Fab>
                        <Typography variant="h4"
                            style ={{marginTop : '5pt', marginLeft : '5pt'}}>Your Lists</Typography>
                    </div>
                    
            </div>
    )
}