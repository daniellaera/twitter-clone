import { Grid, Snackbar, Tooltip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import moment from 'moment';
import { useState } from 'react';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';
import { useMe, usePost } from '../utils/hooks';
import { CommentButton } from './CommentButton';
import { DeleteButton } from './DeleteButton';

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
    cardHovered: {
      transition: 'transform 0.80s ease-in-out'
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Post = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alert, setAlert] = useState(false);
  const classes = useStyles();
  const { post } = usePost();
  const { me } = useMe();

  const [state, setState] = useState({
    raised: false,
    shadow: 1
  });

  const truncate = (str: string) => {
    return str.length > 1 ? str.substring(0, 1) + '' : str;
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(false);
  };

  return post ? (
    <>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
      {post.map(({ id, author, authorId, text, createdAt, comments, likes }, i) => (
        <Grid container direction="row" justifyContent="center" alignItems="center" key={i}>
          <Card
            className={classes.root}
            classes={{ root: state.raised ? classes.cardHovered : '' }}
            onMouseOver={() => setState({ raised: true, shadow: 3 })}
            onMouseOut={() => setState({ raised: false, shadow: 1 })}
            raised={state.raised}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {truncate(author.username)}
                </Avatar>
              }
              title={'author: ' + author.username}
              subheader={moment(createdAt).format('Do MMMM YYYY')}
            />
            <CardContent>
              <Typography color="textSecondary" variant="h6" component="p">
                {text}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton aria-label="like">
                <StyledBadge badgeContent={likes?.length} color="secondary">
                  <Tooltip title="Smash the Like button!">
                    <ThumbUpIcon
                      onClick={async e => {
                        e.preventDefault();
                        const { data, error } = await fetcher('/api/like/create', {
                          id,
                          authorId,
                          author
                        });
                        if (error) {
                          setAlertMessage(error);
                          setAlert(true);
                        }
                        mutate('/api/post');
                      }}
                      type="submit"
                    />
                  </Tooltip>
                </StyledBadge>
              </IconButton>
              <CommentButton id={id} comments={comments} />
              {me && author.id === me.id && <DeleteButton id={id} post={post} />}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  ) : (
    <LinearProgress />
  );
};
