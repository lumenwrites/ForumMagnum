import React, { useState } from 'react';
import { Components, registerComponent } from "../../lib/vulcan-lib";
import Card from '@material-ui/core/Card';
import { canNominate } from '../../lib/reviewUtils';
import { useCurrentUser } from '../common/withUser';

const styles = (theme: ThemeType): JssStyles => ({
  button: {
    ...theme.typography.smallText,
    ...theme.typography.commentStyle,
    paddingLeft: 6,
    paddingRight: 12,
    cursor: "pointer"
  },
  card: {
    padding: 12,
  },
  disabled: {
    cursor: "unset",
    color: theme.palette.grey[500]
  }
})

const PostsItemReviewVote = ({classes, post}: {classes:ClassesType, post:PostsBase}) => {
  const { ReviewVotingWidget, LWPopper, LWTooltip } = Components
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const currentUser = useCurrentUser()

  if (!canNominate(currentUser, post)) return null

  return <div onMouseLeave={() => setAnchorEl(null)}>

    <LWTooltip title={<div>Nominate this post by casting a preliminary vote.</div>} placement="right">
      <div className={classes.button} onClick={(e) => setAnchorEl(e.target)}>
        Vote
      </div>
    </LWTooltip>

    <LWPopper placement="right" anchorEl={anchorEl} open={!!anchorEl}>
      <Card className={classes.card}>
        <ReviewVotingWidget post={post} />
      </Card>
    </LWPopper>
  </div>
}

const PostsItemReviewVoteComponent = registerComponent('PostsItemReviewVote', PostsItemReviewVote, {styles});

declare global {
  interface ComponentTypes {
    PostsItemReviewVote: typeof PostsItemReviewVoteComponent
  }
}