/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';


export default function CDialog({ openDialog, closeDialog, children,maxWidth }) {

  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth
      onClose={closeDialog}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
    >
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}