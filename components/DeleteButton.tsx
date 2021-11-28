import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';

interface DeleteButtonProps {
  id: number;
  post: PostProps;
}

interface PostProps {
  filter: any;
  id: number;
  createdAt: Date;
  text: string;
  authorId: number;
}

export const DeleteButton = ({ id, post }: Pick<DeleteButtonProps, 'id' | 'post'>) => (
  <IconButton
    edge="end"
    color="secondary"
    onClick={async () => {
      await fetcher('/api/post/delete', { id });
      await mutate(
        '/api/post',
        post.filter((t: PostProps) => t.id !== id)
      );
    }}>
    <DeleteIcon />
  </IconButton>
);
