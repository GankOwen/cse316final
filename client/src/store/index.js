import { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth';

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    CHANGE_ITEM_NAME: "CHANGE_ITEM_NAME",
    PUBLISH_COMMENT:"PUBLISH_COMMENT",
    LOAD_ALL_ID_NAME_PAIRS: "LOAD_ALL_ID_NAME_PAIRS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        homePage: true,
        allListPage:false,
        userListPage: false,
        searchingKey: null
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.PUBLISH_COMMENT: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }

            case GlobalStoreActionType.LOAD_ALL_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }

            case GlobalStoreActionType.CHANGE_ITEM_NAME:{
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(auth.user.email === top5List.ownerEmail){
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArrayOfDB = response.data.idNamePairs;
                                let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

    store.publishList = async function (id,name, items) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(auth.user.email === top5List.ownerEmail){
                console.log(name);
                top5List.name = name;
                top5List.items = items;
                top5List.ifPublished = true;
                var today = new Date();
                var dd = String(today.getDate());
                var mm = String(monthNames[today.getMonth()]);
                var yyyy = today.getFullYear();

                // for(var i = 0; i < items)
                // top5List.publishedItems = 

                today = mm + '/' + dd + '/' + yyyy;
                console.log(today);
                top5List.date = today;
                console.log("top5 date", top5List.date);
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArrayOfDB = response.data.idNamePairs;
                                let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
    }




    store.changeItemName = function(id, newName, index){
        async function asyncChangeListName(id){
            let response = await api.getTop5ListById(id);
            if(response.data.success){
                let top5List = response.data.top5List;
                if(auth.user.email === top5List.ownerEmail){
                    top5List.items[index] = newName;
                    async function updateList(top5List){
                        response = await api.updateTop5ListById(top5List._id, top5List);
                        if(response.data.success){
                            async function getListPairs(top5List){
                                response = await api.getTop5ListPairs();
                                if(response.data.success){
                                    let pairsArrayOfDB = response.data.idNamePairs;
                                    let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                    storeReducer({
                                        type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                        payload: {
                                            idNamePairs : pairsArray,
                                            top5List: top5List
                                        }
                                    });
                                }
                            }
                            getListPairs(top5List);
                        }
                    }
                    updateList(top5List);
                }
            }
        }
        asyncChangeListName(id);
    }

    // store.getComments = function(id){
    //     async function asyncLoadComment(id){

    //     }
    //     asyncLoadComment
    // }




    store.increaseLikeNumber = function(id){
        async function asyncIncreaseLikeNumber(id){         
            let response = await api.getTop5ListById(id);
            if(response.data.success){
                let top5List = response.data.top5List;
                if(auth.user.email === top5List.ownerEmail){
                    if(top5List.userLikeList.indexOf(auth.user.email)===-1 && top5List.userDislikeList.indexOf(auth.user.email)===-1){
                        top5List.userLikeList.push(auth.user.email);
                        top5List.likeNumber = top5List.likeNumber +1;
                        async function updateList(top5List){
                            response = await api.updateTop5ListById(top5List._id, top5List);
                            if(response.data.success){
                                async function getListPairs(top5List){
                                    response = await api.getTop5ListPairs();
                                    if(response.data.success){
                                        let pairsArrayOfDB = response.data.idNamePairs;
                                        let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                        storeReducer({
                                            type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                            payload: {
                                                idNamePairs : pairsArray,
                                                top5List: top5List
                                            }
                                        });
                                    }
                                }
                                getListPairs(top5List);
                            }
                        }
                        updateList(top5List);
                    }else if(top5List.userDislikeList.indexOf(auth.user.email)!==-1 && top5List.userLikeList.indexOf(auth.user.email)===-1){
                        top5List.userDislikeList.splice(top5List.userDislikeList.indexOf(auth.user.email), 1);
                        top5List.userLikeList.push(auth.user.email);
                        top5List.dislikeNumber = top5List.dislikeNumber -1;
                        top5List.likeNumber = top5List.likeNumber +1;
                        async function updateList(top5List){
                            response = await api.updateTop5ListById(top5List._id, top5List);
                            if(response.data.success){
                                async function getListPairs(top5List){
                                    response = await api.getTop5ListPairs();
                                    if(response.data.success){
                                        let pairsArrayOfDB = response.data.idNamePairs;
                                        let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                        storeReducer({
                                            type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                            payload: {
                                                idNamePairs : pairsArray,
                                                top5List: top5List
                                            }
                                        });
                                    }
                                }
                                getListPairs(top5List);
                            }
                        }
                        updateList(top5List);
                    }
                }
            }
        }
        asyncIncreaseLikeNumber(id);
    }


    store.decreaseLikeNumber = function(id){
        async function asyncDecreaseLikeNumber(id){         
            let response = await api.getTop5ListById(id);
            if(response.data.success){
                let top5List = response.data.top5List;
                if(auth.user.email === top5List.ownerEmail){
                    if(top5List.userDislikeList.indexOf(auth.user.email)===-1 && top5List.userLikeList.indexOf(auth.user.email)===-1){
                        top5List.userDislikeList.push(auth.user.email);
                        top5List.dislikeNumber = top5List.dislikeNumber +1;
                        async function updateList(top5List){
                            response = await api.updateTop5ListById(top5List._id, top5List);
                            if(response.data.success){
                                async function getListPairs(top5List){
                                    response = await api.getTop5ListPairs();
                                    if(response.data.success){
                                        let pairsArrayOfDB = response.data.idNamePairs;
                                        let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                        storeReducer({
                                            type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                            payload: {
                                                idNamePairs : pairsArray,
                                                top5List: top5List
                                            }
                                        });
                                    }
                                }
                                getListPairs(top5List);
                            }
                        }
                        updateList(top5List);
                    }else if(top5List.userLikeList.indexOf(auth.user.email)!==-1 && top5List.userDislikeList.indexOf(auth.user.email)===-1){
                        top5List.userLikeList.splice(top5List.userLikeList.indexOf(auth.user.email), 1);
                        top5List.userDislikeList.push(auth.user.email);
                        top5List.likeNumber = top5List.likeNumber -1;
                        top5List.dislikeNumber = top5List.dislikeNumber +1;
                        async function updateList(top5List){
                            response = await api.updateTop5ListById(top5List._id, top5List);
                            if(response.data.success){
                                async function getListPairs(top5List){
                                    response = await api.getTop5ListPairs();
                                    if(response.data.success){
                                        let pairsArrayOfDB = response.data.idNamePairs;
                                        let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                        storeReducer({
                                            type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                            payload: {
                                                idNamePairs : pairsArray,
                                                top5List: top5List
                                            }
                                        });
                                    }
                                }
                                getListPairs(top5List);
                            }
                        }
                        updateList(top5List);
                    }
                }
            }
        }
        asyncDecreaseLikeNumber(id);
    }

    useEffect(()=> {console.log("store deleteMakr:", store.deleteMarkedList)},[store]);

    store.publishComment = async function (id, commentAuthor, comment){
        let response = await api.getTop5ListById(id);
        if(response.data.success){
            let top5List = response.data.top5List;
            top5List.comments.push(comment);
            top5List.commentAuthors.push(commentAuthor);
            async function updateList(top5List){
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.data.success) {
                            console.log("check 1:", top5List)
                            let pairsArrayOfDB = response.data.idNamePairs;
                            let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                            storeReducer({
                                type: GlobalStoreActionType.PUBLISH_COMMENT,
                                payload: {
                                    idNamePairs: pairsArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }
            updateList(top5List);
        }
    }

    store.increaseViewNumber = function(id){
        async function asyncChangeListName(id){
            let response = await api.getTop5ListById(id);
            if(response.data.success){
                let top5List = response.data.top5List;
                if(auth.user.email === top5List.ownerEmail){
                    top5List.viewNumber = top5List.viewNumber + 1;
                    async function updateList(top5List){
                        response = await api.updateTop5ListById(top5List._id, top5List);
                        if(response.data.success){
                            async function getListPairs(top5List){
                                response = await api.getTop5ListPairs();
                                if(response.data.success){
                                    let pairsArrayOfDB = response.data.idNamePairs;
                                    let pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                                    storeReducer({
                                        type:GlobalStoreActionType.CHANGE_ITEM_NAME,
                                        payload: {
                                            idNamePairs : pairsArray,
                                            top5List: top5List
                                        }
                                    });
                                }
                            }
                            getListPairs(top5List);
                        }
                    }
                    updateList(top5List);
                }
            }
        }
        asyncChangeListName(id);
        history.push(0)
    }

    function filterEmailForUser(list){
        if(list.ownerEmail === auth.user.email){
            return true;
        }
        return false;
    }

    function filterPublishedListForAllUser(list){
        if(list.ifPublished === true && store.searchingKey!== null && (list.name).startsWith(store.searchingKey)){
            return true;
        }
        return false;
    }

    function filterPublishedListForSingleUser(list){
        console.log("published: ",list.ifPublished, "search key if null :", store.searchingKey!== null, "if author equal: ",list.author === store.searchingKey)
        if(list.ifPublished === true && store.searchingKey!== null && (list.userName).startsWith(store.searchingKey)){
            return true;
        }
        return false;
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        console.log("close list")
        store.loadIdNamePairs();
        history.push(0);
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            author: (auth.user.firstName + " "+ auth.user.lastName),
            likeNumber : 0,
            dislikeNumber : 0,
            ifPublished: false,
            viewNumber: 0,
            ifLike: false,
            ifDislike: false,
            userName: auth.user.userName
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            console.log(auth.user);
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push(0);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.loadAllUserIdNamePairs = async function (){
        const response = await api.getTop5ListPairs();
        if (response.data.success) {
            let pairsArrayOfDB = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_All_ID_NAME_PAIRS,
                payload: pairsArrayOfDB
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        const response = await api.getTop5ListPairs();
        if (response.data.success) {
            let pairsArrayOfDB = response.data.idNamePairs;
                let pairsArray = pairsArrayOfDB
                console.log("seaching key in filter : ", store.searchingKey)
                console.log("page::::", auth.page);
                if(auth.page === 'home'){
                    pairsArray = pairsArrayOfDB.filter(filterEmailForUser);
                }
                if(auth.page === 'single user'){
                    pairsArray = pairsArrayOfDB.filter(filterPublishedListForSingleUser);
                }else if(auth.page === 'all user'){
                    pairsArray = pairsArrayOfDB.filter(filterPublishedListForAllUser);
                }
                console.log("searching check: ",pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }


    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        console.log("prepare:",id);
        let response = await api.getTop5ListById(id);
        
        if (response.data.success) {
            let top5List = response.data.top5List;
            console.log("success",top5List);
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        console.log("check4: ", store.listMarkedForDeletion)
        if(auth.user.email===store.listMarkedForDeletion.ownerEmail){
            store.deleteList(store.listMarkedForDeletion);
        }
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            if(response.data.top5List.ownerEmail===auth.user.email){
                let top5List = response.data.top5List;
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                    history.push(0);
                }
            }
        }
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        console.log(store.currentList.name)
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
        store.loadIdNamePairs();
        history.push(0);
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };