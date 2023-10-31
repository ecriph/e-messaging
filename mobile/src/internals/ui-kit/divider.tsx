import styled from 'styled-components/native';
import { Colors } from './theme';

interface DividerProps {
  height?: string;
  mr?: string;
  ml?: string;
  mb?: string;
  width?: string;
}
export const Divider = styled.View<DividerProps>`
  background-color: ${Colors.grey};
  height: ${({ height }) => height || '0.3px'};
  margin-right: ${({ mr }) => mr || '-20px'};
  margin-left: ${({ ml }) => ml || '-20px'};
  margin-bottom: ${({ mb }) => mb || '24px'};
  width: ${({ width }) => width || 'auto'};
`;
