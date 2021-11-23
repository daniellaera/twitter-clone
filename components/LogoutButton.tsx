import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import { useState } from 'react';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';

const styles = {
  root: {
    marginLeft: 5
  }
};

const SpinnerAdornment = withStyles(styles)(props => <CircularProgress size={20} color={'secondary'} />);

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setLoading(true);
        const { data, error } = await fetcher('/api/logout', {});
        if (error) {
          // message.error(error);
          setLoading(false);
          return;
        }
        await mutate('/api/me');
      }}
      color="inherit">
      {loading && <SpinnerAdornment />}
      Logout
    </Button>
    // <Button
    //   loading={loading}
    //   onClick={async () => {
    //     setLoading(true);
    //     const { data, error } = await fetcher("/api/logout", {});
    //     if (error) {
    //       message.error(error);
    //       setLoading(false);
    //       return;
    //     }
    //     await mutate("/api/me");
    //   }}
    // >
    //   Log Out
    // </Button>
  );
};
