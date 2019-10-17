import { transparentize, tint } from 'polished';

export default {
  primary: '#1A70DC',
  primaryHover: transparentize(0.65, '#1A70DC'),
  primaryLight: tint(0.25, '#1A70DC'),
  background: '#ffffff',
  backgroundLight: '#dfdfdf',
  backgroundSub: '#efefef',
  text: '#0a0c0d',
  label: '#919496',
  border: '#bdbec0',
};
