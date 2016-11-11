import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";

const PostsHome = (props, context) => {
  const terms = props.location && props.location.query;
  return <Telescope.components.PostsList terms={terms}/>
};

PostsHome.displayName = "PostsHome";

module.exports = PostsHome;