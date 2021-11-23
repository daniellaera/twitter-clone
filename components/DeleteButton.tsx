import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';

export const DeleteButton = ({ id, post }) => (
  <IconButton
    edge="end"
    color="secondary"
    onClick={async () => {
      await fetcher('/api/post/delete', { id });
      await mutate(
        '/api/post',
        post.filter(t => t.id !== id)
      );
    }}>
    <DeleteIcon />
  </IconButton>
);
