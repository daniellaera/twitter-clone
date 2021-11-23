import { createStyles, Theme } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { withStyles } from '@material-ui/styles';
import RouterLink from './RouterLink';

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

export const CommentButton = ({ id, comments }) => {
  return (
    <RouterLink tabIndex={id} href={`/post/${id}`}>
      <IconButton aria-label="like">
        <StyledBadge badgeContent={comments?.length} color="primary">
          <CommentIcon />
        </StyledBadge>
      </IconButton>
    </RouterLink>
  );
};
