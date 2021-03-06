declare module '*.txt';
declare type ActionCallback<T = any> = (error?: boolean, json?: any) => void;


declare interface LinkType {
  prefix: string;
  boardId: string;
  id?: string;
  params?: any;
}

declare interface BoardRecord {
  key: string;
  title: string;
  posts: List<PostRecord>;
  notice: List<PostRecord>;
  updated?: string;
}

declare interface UserRecord {
  name: string;
  id: string;
  level?: number;
  experience?: number;
  age?: number;
  image?: string;
}

declare interface PostItemRecord {
  key: string;
  url: string;
  subject: string;
  user: UserRecord;
  likes?: number;
  dislikes?: number;
  views: number;
  commentSize?: number;
  date?: string;
  hasDetail?: boolean;
}

declare interface PostDetailRecord extends PostItemRecord {
  contents: ContentRecord[];
  comments: CommentRecord[];
}

declare interface CommentRecord {
  key: string;
  child?: string;
  reply?: string;
  best?: boolean;
  content: Array<
    { type: 'image' | 'share' | 'text', value: string }
  >;
  user: UserRecord;
  time?: string;
  likes: number;
  dislike: number;
  isDeleted?: boolean;
}

declare interface ContentRecord {
  key: string;
  type: 'image' | 'object' | 'text' | 'reference' | 'video' | 'link';
  style?: any;
  content: string;
  /** only on image */
  size?: { width: number, height: number };
}
