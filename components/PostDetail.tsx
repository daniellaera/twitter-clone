import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Snackbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { blue, red } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { createStyles, withStyles } from '@material-ui/styles';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetcher } from '../utils/fetcher';
import { useMe } from '../utils/hooks';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -6,
      top: 3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  })
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      padding: '2px 4px',
      display: 'inline-block',
      // maxWidth: 400,
      width: '80%',
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    },
    paper: {
      margin: theme.spacing(1),
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 500
    },
    inline: {
      display: 'inline'
    },
    avatar: {
      backgroundColor: red[500]
    },
    commentsAvatar: {
      backgroundColor: blue[500]
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

export default function useQuery() {
  const router = useRouter();

  const hasQueryParams = /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;

  if (!ready) return null;

  return router.query;
}

export const PostDetail = ({ pst, id, authorId }) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const { me } = useMe();

  const query = useQuery();

  useEffect(() => {
    if (!query) {
      return;
    }
    // fetch the dynamic page routeId
    console.log('my query exists!!', query);
  }, [query]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(false);
  };

  const truncate = (str: string) => {
    return str.length > 1 ? str.substring(0, 1) + '' : str;
  };

  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {truncate(pst.author.username)}
              </Avatar>
            }
            title={'author: ' + pst.author.username}
            subheader={moment(pst.createdAt).format('Do MMMM YYYY')}
          />
          <CardContent>
            <Typography color="textSecondary" variant="h6" component="p">
              {pst.text}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="like">
              <StyledBadge badgeContent={pst.likes?.length} color="secondary">
                <Tooltip title="Smash the Like button!">
                  <ThumbUpIcon
                    onClick={async e => {
                      e.preventDefault();
                      await fetcher('/api/like/create', {
                        id
                      });
                      router.push(`/post/${id}`, `/post/${id}`);
                    }}
                    type="submit"
                    aria-label="send"
                  />
                </Tooltip>
              </StyledBadge>
            </IconButton>
          </CardActions>
        </Card>

        <Snackbar
          open={alert}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="warning">
            {alertMessage}
          </Alert>
        </Snackbar>

        <Paper className={classes.paper}>
          <InputBase
            value={input}
            onChange={e => setInput(e.target.value)}
            className={classes.input}
            placeholder="What do you think?"
          />
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton
            onClick={async e => {
              e.preventDefault();
              const { data, error } = await fetcher('/api/comment/create', {
                text: input,
                id
              });
              if (!me || !me.username) {
                setAlert(true);
                setAlertMessage(error);
                // message.error("You must be logged in to tweet.");
                return;
              }
              router.push(`/post/${id}`, `/post/${id}`);
              setInput('');
            }}
            type="submit"
            color="primary"
            className={classes.iconButton}
            aria-label="send"
            disabled={input.length < 1}>
            <SendIcon />
          </IconButton>
        </Paper>

        {pst.comments.map(({ id, author, text }, i) => (
          <List className={classes.root} key={i}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar className={classes.commentsAvatar}>{truncate(author.username)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={text}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                      {author.username}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        ))}
      </Grid>
    </>
  );
};
