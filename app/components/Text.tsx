import React from 'react';
import { Text as Warpper, TextProps } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';
import { fontSize } from 'app/styles/static';

interface Props extends TextProps {
  color?: 'gray' | 'red' | 'primary';
  shade?: 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  size?: keyof typeof fontSize;
  style?: any[];
  children: string | number;
}

export default function Text({
  children, color = 'gray', shade = 700, size = 100, style = [],
  ...rest
}: Props) {
  const theme = useSelector(getTheme);
  return (
    <Warpper
      style={[{
        // @ts-ignore
        color: theme[color][shade],
        fontSize: fontSize[size],
        lineHeight: fontSize[size] * 1.25,
      }, ...style]}
      {...rest}
    >
      {children}
    </Warpper>
  );
}