/* global Vulcan */
import { Comments } from '../../lib/collections/comments'
import { Posts } from '../../lib/collections/posts'
import { wrapVulcanAsyncScript } from '../scripts/utils'

import { batchUpdateScore } from 'meteor/vulcan:voting';

Vulcan.forceBatchUpdateScores = wrapVulcanAsyncScript('forceBatchUpdateScores', async () => {
  // Posts
  const nActivePostsUpdated = await batchUpdateScore({
    collection: Posts,
    forceUpdate: true
  })
  console.log('nActivePostsUpdated', nActivePostsUpdated)
  const nInactivePostsUpdated = await batchUpdateScore({
    collection: Posts,
    inactive: true,
    forceUpdate: true
  })
  console.log('nInactivePostsUpdated', nInactivePostsUpdated)

  // Comments
  const nActiveCommentsUpdated = await batchUpdateScore({
    collection: Comments,
    forceUpdate: true
  })
  console.log('nActiveCommentsUpdated', nActiveCommentsUpdated)
  const nInactiveCommentsUpdated = await batchUpdateScore({
    collection: Comments,
    inactive: true,
    forceUpdate: true
  })
  console.log('nInactiveCommentsUpdated', nInactiveCommentsUpdated)
})
