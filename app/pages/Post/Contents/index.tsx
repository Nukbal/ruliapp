import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'components/Text';

import ShareCard from 'components/ShareCard';
import LazyImage from 'components/LazyImage';
import LazyVideo from 'components/LazyVideo';
import Link from 'components/Link';

export const styles = StyleSheet.create({
  media: {
    height: 200,
    marginTop: 6,
    marginBottom: 6,
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default function ContentItem({ type, content, style }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Link label="출처: " to={content} />;
    }
    case 'object': {
      return (
        <ShareCard uri={content} />
      );
    }
    case 'image': {
      return (
        <LazyImage source={{ uri: content }} />
      );
    }
    case 'video': {
      return (
        <LazyVideo source={{ uri: content }} />
      );
    }
    case 'link': {
      return <Link to={content} />;
    }
    default: {
      return <Text style={[styles.text, style]}>{content}</Text>;
    }
  }
}
