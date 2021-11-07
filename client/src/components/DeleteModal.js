import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

export default function DeleteModal(props){
    const {open,close,name,confirm} = props;

    return(
        <Dialog
            id = "delete-modal"
            maxWidth='sm'
            open= {open}
            onClose={close}
            >
            <DialogTitle>
               Delete the {name} Top5 List?
               <DialogActions>
                    <Button onClick={confirm}>Confirm</Button>
                    <Button onClick={close}>Cancel</Button>
                </DialogActions>
            </DialogTitle>
        </Dialog>
    )
}