import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import * as _ from 'underscore';
import { useMulti } from '../../lib/crud/withMulti';
import TagFlags from '../../lib/collections/tagFlags/collection';

const styles = (theme: ThemeType): JssStyles => ({
  
});

const TagFlagToggleList = ({ value, path }, context) => {
  const { Loading, TagFlagItem } = Components

  const handleClick = (option) => {    
    if (value && value.includes(option)) {
      context.updateCurrentValues({
        [path]: _.without(value, option)
      })
    } else {
      context.updateCurrentValues({
        [path]: [...value, option]
      })
    }
  }

  const { results, loading } = useMulti({
    terms: {
      view: "allTagFlags"
    },
    collection: TagFlags,
    fragmentName: 'TagFlagFragment',
    enableTotal: false,
    limit: 100
  });

  if (loading) return <Loading />

  return <div className="multi-select-buttons">
    {results?.map(({_id}) => {
      const selected = value && value.includes(_id);
      return <a key={_id} onClick={() => handleClick(_id)}>
        <TagFlagItem documentId={_id} style={selected ? "grey" : "white"} showNumber={false} />
      </a>
    })}
  </div>
}

(TagFlagToggleList as any).contextTypes = {
  updateCurrentValues: PropTypes.func,
};

const TagFlagToggleListComponent = registerComponent("TagFlagToggleList", TagFlagToggleList, {styles});

declare global {
  interface ComponentTypes {
    TagFlagToggleList: typeof TagFlagToggleListComponent
  }
}