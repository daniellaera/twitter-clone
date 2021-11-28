import { createStyles, Theme } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { withStyles } from '@material-ui/styles';
import Link from 'next/link';

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

interface AuthorProps {
  id: number;
  createdAt: Date;
  email: string;
  password: string;
  imageUrl: string;
}

interface LikeProps {
  id: number;
  createdAt: Date;
  postId: number;
  post: PostProps;
  authorId: number;
  author: AuthorProps;
  length: any;
}
interface PostProps {
  id: number;
  createdAt: Date;
  text: string;
  authorId: number;
  author: AuthorProps;
  comments: CommentProps;
  likes: LikeProps;
}

interface CommentProps {
  id: number;
  createdAt: Date;
  text: string;
  postId: number;
  post: PostProps;
  authorId: number;
  author: AuthorProps;
  length: any;
}

interface CommentButtonProps {
  id: number;
  comments: CommentProps;
}

export const CommentButton = ({ id, comments }: CommentButtonProps) => {
  return (
    <Link passHref href={`/post/${id}`}>
      <IconButton aria-label="like">
        <StyledBadge badgeContent={comments?.length} color="primary">
          <CommentIcon />
        </StyledBadge>
      </IconButton>
    </Link>
  );
};
