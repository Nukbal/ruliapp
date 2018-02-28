import { put, call, takeLatest, take, race } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import cheerio from 'cheerio-without-node-native';

import { showLoading, hideLoading } from './loading';
import { arrayToObject } from '../../utils/commonUtils';

export const actionType = {
  REQUEST_COMMENTS: 'REQUEST_COMMENTS',
  REQUEST_COMMENTS_DONE: 'REQUEST_COMMENTS_DONE',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
};

export function requestComments(prefix, boardId, articleId, page) {
  return {
    type: actionType.REQUEST_COMMENTS,
    payload: {
      prefix,
      boardId,
      articleId,
      page,
    },
  }
}

export function parseComments($) {
  return $('table.comment_table:not(.best) tr').map((_, item) => {
    const id = item.attribs.id.replace('ct_', '');
    const userElem = $('td.user', item);
    const user = {
      name: userElem.find('.nick').text().trim(),
      id: userElem.find('span.member_srl').text().trim(),
      ip: userElem.find('p.ip').text(),
    };
    const like = $('button.btn_like', item).text().trim();
    const dislike = $('button.btn_dislike', item).text().trim();
    const time = $('span.time', item).text();
    const comment = $('td.comment span.text', item).text().trim();
    const isChild = $(item).hasClass('child');

    return {
      id,
      key: id,
      user,
      like,
      dislike,
      time,
      isChild,
      comment
    };
  }).get();
}

async function getComments({ prefix, boardId, articleId, page }) {
  const params = {
    page,
    article_id: articleId,
    board_id: boardId,
    cmtimg: 1,
  };

  const config = {
    method: 'GET',
    body: JSON.stringify(params),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate',
      Referer: targetUrl,
      'User-Agent': 'Mozilla/5.0',
    }
  };

  const response = await fetch('https://api.ruliweb.com/commentView', config);
  const json = await response.json();

  if (!json.success) return;

  const $ = cheerio.load(json.view);
}

export function* requestBoard({ payload }) {
  const json = yield call(getListData, payload);

  yield put({
    type: actionType.REQUEST_BOARD_LIST_DONE,
    payload: json,
  });
}

export const boardSagas = [
  takeLatest(actionType.REQUEST_BOARD_LIST, requestBoard),
];

export const getBoardState = state => state.boards;

export const getBoardList = createSelector(
  [getBoardState],
  boards =>  boards.items,
);

export const getBoardInfo = createSelector(
  [getBoardState],
  ({ boardId, prefix }) => ({
    boardId,
    prefix,
  }),
);

const initState = {};

const actionHandler = {
  [actionType.REQUEST_COMMENTS]: (state, { payload }) => {
    const { prefix, boardId, articleId } = payload;
    return { boardId, prefix, articleId, loading: true };
  },
  [actionType.REQUEST_COMMENTS_DONE]: (state, { payload }) => {
    const { prefix, boardId, articleId } = state;
    const order = payload.map(item => item.id);
    const comments = arrayToObject(payload);
    return { boardId, prefix, articleId, comments, order };
  },
  [actionType.UPDATE_COMMENTS]: (state, { payload }) => {
    const { prefix, boardId, articleId, comments, order } = state;
    const listOrder = payload.map(item => item.id);
    const commentList = arrayToObject(payload);
    const newOrder = order.concat(listOrder);

    return { boardId, prefix, articleId, comments: Object.assign(comments, commentList), newOrder };
  }
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}