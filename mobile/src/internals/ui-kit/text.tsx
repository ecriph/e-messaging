import styled from 'styled-components/native';
import { Colors, FontSize, Font } from './theme';

interface TextProps {
  weight?: string;
  lineHeight?: string;
  color?: string;
  font?: string;
  ml?: string;
  mt?: string;
  mb?: string;
  fontSize?: number;
  margin?: number;
  align?: 'left' | 'right' | 'center';
}
export const HeaderText1 = styled.Text<TextProps>`
  font-weight: ${({ weight }) => weight || '600'};
  font-size: ${`${FontSize.header1}px`};
  line-height: ${({ lineHeight }) => lineHeight || '30px'};
  color: ${({ color }) => color || `${Colors.black}`};
  font-family: ${({ font }) => font || `${Font.Bold}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
`;

export const HeaderText2 = styled.Text<TextProps>`
  font-weight: ${({ weight }) => weight || '600'};
  font-size: ${`${FontSize.header2}px`};
  line-height: ${({ lineHeight }) => lineHeight || '30px'};
  color: ${({ color }) => color || `${Colors.black}`};
  font-family: ${({ font }) => font || `${Font.Regular}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-top: ${({ mb }) => mb || '0px'};
`;

export const HeaderText3 = styled.Text<TextProps>`
  font-size: ${({ fontSize }) => fontSize || `${FontSize.header3}px`};
  line-height: ${({ lineHeight }) => lineHeight || '30px'};
  font-weight: ${({ weight }) => weight || '400'};
  color: ${({ color }) => color || `${Colors.black}`};
  margin-top: ${({ mt }) => mt || '0px'};
  font-family: ${({ font }) => font || `${Font.Bold}`};
  margin-bottom: ${({ mb }) => mb || '0px'};
`;

export const HeaderText4 = styled.Text<TextProps>`
  font-size: ${`${FontSize.header4}px`};
  line-height: ${({ lineHeight }) => lineHeight || '24px'};
  font-weight: ${({ weight }) => weight || '400'};
  color: ${({ color }) => color || `${Colors.black}`};
  font-family: ${({ font }) => font || `${Font.Bold}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-bottom: ${({ mb }) => mb || '0px'};
`;

export const SubHeaderText = styled.Text<TextProps>`
  font-size: ${({ fontSize }) => fontSize || `${FontSize.subheader}px`};
  line-height: ${({ lineHeight }) => lineHeight || '24px'};
  font-weight: ${({ weight }) => weight || '100'};
  color: ${({ color }) => color || `${Colors.grey}`};
  font-family: ${({ font }) => font || `${Font.Regular}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-bottom: ${({ mb }) => mb || '0px'};
`;

export const NormalText = styled.Text<TextProps>`
  color: ${({ color }) => color || `${Colors.black}`};
  font-weight: ${({ weight }) => weight || '400'};
  font-size: ${({ fontSize }) => fontSize || `${FontSize.normal1}px`};
  line-height: ${({ lineHeight }) => lineHeight || '20px'};
  margin: ${({ margin }) => margin || 0};
  text-align: ${({ align }) => align || 'left'};
  font-family: ${({ font }) => font || `${Font.Regular}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-bottom: ${({ mb }) => mb || '0px'};
`;

export const SmallText = styled.Text<TextProps>`
  color: ${({ color }) => color || `${Colors.black}`};
  font-weight: ${({ weight }) => weight || '600'};
  font-size: ${({ fontSize }) => fontSize || `${FontSize.small}px`};
  line-height: ${({ lineHeight }) => lineHeight || '20px'};
  text-align: ${({ align }) => align || 'left'};
  font-family: ${({ font }) => font || `${Font.SemiBold}`};
  margin-top: ${({ mt }) => mt || '0px'};
  margin-bottom: ${({ mb }) => mb || '0px'};
`;

export const NormalText1 = styled.Text<TextProps>`
  color: ${({ color }) => color || `${Colors.black}`};
  font-weight: ${({ weight }) => weight || '400'};
  font-size: ${`${FontSize.normal2}px`};
  line-height: ${({ lineHeight }) => lineHeight || '20px'};
  margin: ${({ margin }) => margin || 0};
  text-align: ${({ align }) => align || 'left'};
  font-family: ${({ font }) => font || `${Font.Regular}`};
`;
