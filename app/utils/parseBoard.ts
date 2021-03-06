import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseDate from './parseDate';

function parseTitle(html: string) {
  const startIdx = (html.indexOf('<title>') + 7);
  const endIdx = html.indexOf('</title', startIdx);
  const str = html.substring(startIdx, endIdx);
  return str.substring(0, str.indexOf(' | '));
}

export function parseBoardUrl(href: string) {
  let url = (
    href
      .replace('://m.ruliweb.com/', '')
      .replace('://ruliweb.com/', '')
      .replace('://bbs.ruliweb.com/', '')
      .replace('https', '')
      .replace('http', '')
  );
  let id = null;

  if (url.indexOf('?') > -1) {
    url = url.substring(0, url.indexOf('?'));
  }

  if (url.indexOf('/read/') > -1) {
    id = url.substring(url.indexOf('/read/') + 6, url.length);
  } else {
    id = url;
  }

  return { id, url };
}

export function formatBoardRow(node: INode): PostItemRecord | undefined {
  // @ts-ignore
  const record: PostItemRecord = { user: {} };

  if (!node.childNodes) return;
  const td = node.childNodes[0];

  if (!td.childNodes) return;

  const titleDiv = td.childNodes[0];
  const infoDiv = td.childNodes[1];

  if (!titleDiv || !infoDiv) return;
  if (!titleDiv.childNodes || !infoDiv.childNodes) return;

  let cursor;

  // if (node.attrs!.class!.indexOf('notice') > -1) record.isNotice = true;
  if (node.attrs!.class!.indexOf('notice') > -1) return;

  // board title
  cursor = querySelector(titleDiv, '.subject_link');
  if (cursor && cursor.attrs) {
    const { id, url } = parseBoardUrl(cursor.attrs.href!);
    if (!id) throw new Error('board id not found');
    record.key = id;
    record.url = url;

    const text = querySelector(cursor, 'text');
    if (text) record.subject = text.value!;
  } else throw new Error('board subject not found');

  // board category
  // cursor = querySelector(titleDiv, 'a.cate_label text');
  // const bracketRegex = new RegExp(/[\[|\]]/, 'g');
  // if (cursor) {
  //   record.categoryName = cursor.value!.replace(bracketRegex, '');
  // } else {
  //   cursor = querySelector(infoDiv, 'a.board_name text');
  //   if (cursor) record.categoryName = cursor.value!.replace(bracketRegex, '');
  // }

  // count of comments
  cursor = querySelector(titleDiv, '.num text');
  if (cursor && cursor.value) record.commentSize = parseInt(cursor.value, 10);

  // author name
  cursor = querySelector(infoDiv, '.writer text');
  // @ts-ignore
  if (cursor) record.user = { name: cursor.value! };

  // posted date/time
  cursor = querySelector(infoDiv, '.time text');
  if (cursor && cursor.value) {
    const dateStr = cursor.value.replace('날짜 ', '');
    record.date = parseDate(dateStr);
  }

  // view counts
  cursor = querySelector(infoDiv, '.hit');
  if (cursor && cursor.childNodes.length) {
    const target = cursor.childNodes[cursor.childNodes.length - 1];
    if (target.value) {
      record.views = parseInt(target.value.replace('조회 ', ''), 10);
    } else if (target.childNodes.length) {
      record.views = parseInt(target.childNodes[0].value!, 10);
    }
  }

  cursor = querySelector(infoDiv, '.recomd');
  if (cursor && cursor.childNodes.length) {
    const target = cursor.childNodes[cursor.childNodes.length - 1];
    if (target.value) {
      record.likes = parseInt(target.value.replace('추천 ', ''), 10);
    } else if (target.childNodes.length) {
      record.likes = parseInt(target.childNodes[0].value!, 10);
    }
  }

  return record;
}

export interface IParseBoard {
  title: string;
  rows: PostItemRecord[];
  notices: PostItemRecord[];
}

export default function parseBoardList(htmlString: string): IParseBoard {
  const title = parseTitle(htmlString);
  let startIndex = htmlString.indexOf('<!-- board_main start');
  let endIndex = htmlString.indexOf('<!-- board_main end', startIndex);
  if (startIndex < 0) {
    startIndex = htmlString.indexOf('<table class="board_list_table');
    endIndex = htmlString.indexOf('</table', startIndex) + 8;
  }

  if (startIndex === -1 || endIndex === -1) throw new Error('failed to parse html');

  const html = htmlString.substring(startIndex, endIndex);
  const Nodes = loadHtml(html);

  const boardNodes = querySelectorAll(Nodes, 'tr');
  if (!boardNodes || !boardNodes.length) return { title, rows: [], notices: [] };
  const data = [];

  for (let i = 0; i < boardNodes.length; i += 1) {
    const temp = formatBoardRow(boardNodes[i]);
    if (temp) data.push(temp);
  }

  // const rows = data.filter((item) => !item.isNotice);
  // const notices = data.filter((item) => item.isNotice);

  return {
    title,
    notices: [],
    rows: data,
  };
}
