import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch'
      },
      marginTop: theme.spacing(4)
    },
    margin: {
      margin: theme.spacing(1),
      display: 'flex',
      flexWrap: 'wrap'
    }
  })
);

const styles = {
  root: {
    marginLeft: 5
  }
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SpinnerAdornment = withStyles(styles)(props => <CircularProgress size={20} color={'secondary'} />);

export interface PasswordState {
  password: string;
}

export const SignupForm = () => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);

  const [values, setValues] = useState({
    showPassword: false
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    alert ? setAlert(false) : setError(false);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleChange = (prop: keyof PasswordState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          try {
            const { data, err } = await fetcher(`/api/${login ? 'login' : 'signup'}`, { email, password });
            if ((email.length === 0 && login) || (password.length === 0 && login)) {
              setError(true);
              setLoading(false);
            } else if (err) {
              setAlert(true);
              setAlertMessage(err);
              setLoading(false);
            }
          } catch (err: any) {
            setAlert(true);
            setAlertMessage(err);
            return;
          }
          await mutate('/api/me');
        }}>
        <Snackbar
          open={error}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="error">
            You cannot have a blank email or password 🙁
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
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar className={classes.margin} sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
          <Input
            required
            aria-label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel>
          <Input
            required
            type={values.showPassword ? 'text' : 'password'}
            aria-label="Password"
            value={password}
            onChange={handleChange('password')}
            startAdornment={
              <InputAdornment position="start">
                <VpnKeyIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}>
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button color="primary" className={classes.margin} size="medium" type="submit" variant="outlined">
          {loading && <SpinnerAdornment />}
          {login ? 'Login' : 'Sign up'}
        </Button>
        <div className={classes.margin}>
          <Link onClick={() => setLogin(!login)}>{login ? 'New? Sign Up' : 'Already a user? Log In'}</Link>
        </div>
      </form>
    </Grid>
  );
};
