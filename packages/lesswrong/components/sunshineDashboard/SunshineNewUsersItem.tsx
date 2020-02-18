/* global confirm */
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { withUpdate } from '../../lib/crud/withUpdate';
import React, { useState } from 'react';
import Users from '../../lib/collections/users/collection';
import { Link } from '../../lib/reactRouterWrapper'
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { useCurrentUser } from '../common/withUser';
import { useHover } from '../common/withHover'
import withErrorBoundary from '../common/withErrorBoundary'
import red from '@material-ui/core/colors/red';
import DoneIcon from '@material-ui/icons/Done';
import SnoozeIcon from '@material-ui/icons/Snooze';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import classNames from 'classnames';

const styles = theme => ({
  negativeKarma: {
     color: red['A100']
  },
  info: {
    // Wrap between MetaInfo elements. Non-standard CSS which may not work in Firefox.
    wordBreak: "break-word",
    display: "inline-block"
  },
  truncated: {
    maxHeight: 160,
    overflow: "hidden"
  }
})
const SunshineNewUsersItem = ({ user, classes, updateUser, allowContentPreview=true }: {
  user: any,
  classes: any,
  updateUser?: any,
  allowContentPreview?: boolean,
}) => {
  const currentUser = useCurrentUser();
  const [hidden, setHidden] = useState(false)
  const [truncated, setTruncated] = useState(true)
  const { eventHandlers, hover, anchorEl } = useHover();

  const handleReview = () => {
    updateUser({
      selector: {_id: user._id},
      data: {
        reviewedByUserId: currentUser!._id,
        sunshineSnoozed: false,
        needsReview: false,
      }
    })
  }

  const handleSnooze = () => {
    updateUser({
      selector: {_id: user._id},
      data: {
        needsReview: false,
        reviewedByUserId: currentUser!._id,
        sunshineSnoozed: true
      }
    })
  }

  const handlePurge = async () => {
    if (confirm("Are you sure you want to delete all this user's posts, comments and votes?")) {
      setHidden(true)
      await updateUser({
        selector: {_id: user._id},
        data: {
          reviewedByUserId: currentUser!._id,
          nullifyVotes: true,
          voteBanned: true,
          deleteContent: true,
          needsReview: false,
          banned: moment().add(12, 'months').toDate()
        }
      })
    }
  }

  const showNewUserContent = allowContentPreview && currentUser?.sunshineShowNewUserContent

  const { SunshineListItem, SidebarHoverOver, MetaInfo, SidebarActionMenu, SidebarAction, FormatDate, SunshineNewUserPostsList, SunshineNewUserCommentsList } = Components

  if (hidden) { return null }

  return (
    <span {...eventHandlers}>
      <SunshineListItem hover={hover}>
        <SidebarHoverOver hover={hover} anchorEl={anchorEl}>
          <Typography variant="body2">
            <MetaInfo>
              <div>ReCaptcha Rating: {user.signUpReCaptchaRating || "no rating"}</div>
              <div>Posts: { user.postCount || 0 }</div>
              <div>Comments: { user.commentCount || 0 }</div>
              <hr />
              <div>Big Upvotes: { user.bigUpvoteCount || 0 }</div>
              <div>Upvotes: { user.smallUpvoteCount || 0 }</div>
              <div>Big Downvotes: { user.bigDownvoteCount || 0 }</div>
              <div>Downvotes: { user.smallDownvoteCount || 0 }</div>
              {!showNewUserContent && <React.Fragment>
                <div dangerouslySetInnerHTML={{__html: user.htmlBio}}/>
                <SunshineNewUserPostsList terms={{view:"sunshineNewUsersPosts", userId: user._id}}/>
                <SunshineNewUserCommentsList terms={{view:"sunshineNewUsersComments", userId: user._id}}/>
              </React.Fragment>}
            </MetaInfo>
          </Typography>
        </SidebarHoverOver>
        <div>
          <MetaInfo className={classes.info}>
            { user.karma || 0 }
          </MetaInfo>
          <MetaInfo className={classes.info}>
            <Link className={user.karma < 0 ? classes.negativeKarma : ""} to={Users.getProfileUrl(user)}>
                {user.displayName}
            </Link>
          </MetaInfo>
          <MetaInfo className={classes.info}>
            <FormatDate date={user.createdAt}/>
          </MetaInfo>
          <MetaInfo className={classes.info}>
            { user.email }
          </MetaInfo>
        </div>
        {showNewUserContent &&
          <div className={classNames({[classes.truncated]:truncated})} onClick={() => setTruncated(false)}>
            <div dangerouslySetInnerHTML={{__html: user.htmlBio}}/>
            <SunshineNewUserPostsList truncated={true} terms={{view:"sunshineNewUsersPosts", userId: user._id}}/>
            <SunshineNewUserCommentsList truncated={true} terms={{view:"sunshineNewUsersComments", userId: user._id}}/>
          </div>
        }
        { hover && <SidebarActionMenu>
          {/* to fully approve a user, they most have created a post or comment. Users that have only voted can only be snoozed */}
          {(user.commentCount || user.postCount) ? <SidebarAction title="Review" onClick={handleReview}>
            <DoneIcon />
          </SidebarAction> : null}
          <SidebarAction title="Snooze" onClick={handleSnooze}>
            <SnoozeIcon />
          </SidebarAction>
          <SidebarAction warningHighlight={true} title="Purge User (delete and ban)" onClick={handlePurge}>
            <DeleteForeverIcon />
          </SidebarAction>
        </SidebarActionMenu>}
      </SunshineListItem>
    </span>
  )
}

const SunshineNewUsersItemComponent = registerComponent('SunshineNewUsersItem', SunshineNewUsersItem, {
  styles,
  hocs: [
    withUpdate({
      collection: Users,
      fragmentName: 'SunshineUsersList',
    }),
    withErrorBoundary,
  ]
});

declare global {
  interface ComponentTypes {
    SunshineNewUsersItem: typeof SunshineNewUsersItemComponent
  }
}

