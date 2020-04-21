import { useCallback, useState, useEffect } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';
import parsePost from 'utils/parsePost';
import parseComment from 'utils/parseComment';
import { USER_AGENT } from 'config/constants';
import { useSelector, useDispatch } from 'react-redux';
import {
  getPost, setPost, setComments, getCurrentPostKey,
} from 'stores/post';

export default function usePost() {
  const dispatch = useDispatch();
  const url = useSelector(getCurrentPostKey);
  const data = useSelector(getPost);
  const [ready, setReady] = useState(false);
  const [isCommentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    let isDone = false;
    if (!url) return;
    async function loadPost() {
      setReady(false);
      // if (isWard) setReady(true);
      // if (isDone || isWard) return;
      if (isDone) return;
      if (data.url) {
        if (data.commentSize && data.commentSize > data.comments.length) {
          loadComment();
        }
        setReady(true);
        return;
      }

      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);
      try {
        const targetUrl = `https://m.ruliweb.com/${url}?search_type=name&search_key=%2F%2F%2F`;
        const config = {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'text/html',
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store',
            Pragma: 'no-cache',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': USER_AGENT,
            Referer: targetUrl,
          },
        };

        // @ts-ignore
        const response = await fetch(targetUrl, config);
        if (isDone) return;
        if (!response.ok) throw new Error('request failed');

        const htmlString = await response.text();
        if (isDone) return;

        const json = parsePost(htmlString, '');
        if (!json) throw new Error('parse failed');
        json.url = url;
        json.key = url;
        dispatch(setPost(json));
      } catch (e) {
        if (isDone) return;
        console.error(e);
        Alert.alert('error', '해당 글이 존재하지 않습니다.');
      }
      setReady(true);
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    loadPost();
    return () => {
      isDone = true;
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const loadComment = useCallback(async () => {
    if (!url) return;
    setCommentLoading(true);

    const idx = url.indexOf('/read/');
    let boardId = '';
    if (url.indexOf('board/') > -1) {
      boardId = url.substring(url.indexOf('board/') + 6, idx);
    } else {
      boardId = url.substring(url.indexOf('/', 1) + 1, idx);
    }
    const key = url.substring(idx + 6, url.length);
    let page = 1;

    if (
      data.commentSize
      && data.commentSize > 100
    ) {
      page = 2;
    }

    const config = {
      method: 'POST',
      body: `page=1&article_id=${key}&board_id=${boardId}&cmtimg=${page}`,
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate',
        origin: 'https://m.ruliweb.com',
        referer: `https://m.ruliweb.com/${url}`,
        'User-Agent': USER_AGENT,
      },
    };

    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);
    try {
      // @ts-ignore
      const response = await fetch('https://api.ruliweb.com/commentView', config);
      const json = await response.json();
      if (json.success) {
        const comments = parseComment(json.view);
        dispatch(setComments({ key: url, comments }));
      }
    } catch (e) {
      console.log(e.message);
    }
    setCommentLoading(false);
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [url, dispatch, data.commentSize]);

  return { ...data, url, ready, loadComment, isCommentLoading };
}
