/* eslint-disable react/prop-types */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


export default function CDialog({ openDialog, closeDialog, children, maxWidth }) {

  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth
      onClose={closeDialog}
      open={openDialog}
    >
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}