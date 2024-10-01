/* eslint-disable react/prop-types */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useIsMobile from '../../hook/useIsMobile';


export default function CDialog({ openDialog, closeDialog, children, maxWidth }) {
  const isMobile = useIsMobile()

  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth
      onClose={closeDialog}
      open={openDialog}
      fullScreen={isMobile}
    >
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}