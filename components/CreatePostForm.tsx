import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';
import { useMe, usePost } from '../utils/hooks';

// import Paper from "@material-ui/core/Paper";
const Paper = dynamic(() => import('@material-ui/core/Paper'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 600
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      height: 28,
      margin: 4
    }
  })
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const CreatePostForm = () => {
  const classes = useStyles();
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [input, setInput] = useState('');
  const { post } = usePost();
  const { me } = useMe();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    alert ? setAlert(false) : setError(false);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={async e => {
          e.preventDefault();
          try {
            const { data, error } = await fetcher('/api/post/create', {
              text: input
            });
            if (input.length < 1) {
              setError(true);
              setAlertMessage(error);
              // message.error("Oops! You can't create empty tweets.");
              return;
            }
            if (!me || !me.username) {
              setAlert(true);
              setAlertMessage(error);
              // message.error("You must be logged in to tweet.");
              return;
            }
          } catch (error) {
            console.log('error catched from post!');
          }
          mutate('/api/post', [{ text: input, author: me }, ...post]);
          setInput('');
        }}>
        <Snackbar
          open={error}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="error">
            {alertMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={alert}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="warning">
            {alertMessage}
          </Alert>
        </Snackbar>
        <Paper className={classes.root}>
          <InputBase
            value={input}
            onChange={e => setInput(e.target.value)}
            className={classes.input}
            placeholder="What's on your mind?"
          />
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton
            type="submit"
            color="primary"
            className={classes.iconButton}
            aria-label="send"
            disabled={input.length < 1}>
            <SendIcon />
          </IconButton>
        </Paper>
      </form>
    </Grid>
  );
};
