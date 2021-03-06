import { Chip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FaceIcon from '@material-ui/icons/Face';
import HomeIcon from '@material-ui/icons/Home';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Link from 'next/link';
import React from 'react';
import { useMe } from '../utils/hooks';
import { LogoutButton } from './LogoutButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    button: {
      margin: theme.spacing(1)
    }
  })
);

interface NavbarProps {
  variation?: string | undefined;
  onChildClick?: () => void;
}

export const Navbar = ({ variation, onChildClick }: NavbarProps) => {
  const classes = useStyles();
  const { me } = useMe();
  if (!me) return null;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          {!me.email ? (
            <Typography variant="subtitle1" className={classes.title}>
              <Chip icon={<AccountCircleIcon />} label="Not logged in" color="secondary" variant="outlined" />
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" className={classes.title}>
                <Tooltip title="Go to settings">
                  <Chip icon={<FaceIcon />} label={me.email} clickable color="primary" />
                </Tooltip>
              </Typography>
              <LogoutButton />
            </>
          )}
          <IconButton onClick={onChildClick} edge="start" className={classes.button} color="inherit" aria-label="menu">
            {variation == 'light' ? <Brightness3Icon /> : <WbSunnyIcon />}
          </IconButton>
          <Link href={`/`} passHref>
            <IconButton color="inherit" aria-label="menu">
              <HomeIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};
