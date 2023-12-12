// ErrorOverlayModal.tsx
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Colors } from './theme';

interface ErrorOverlayModalProps {
  isVisible: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

const CloseButton = styled.Text`
  font-size: 16px;
  color: ${Colors.green};
`;

const ErrorOverlayModal: React.FC<ErrorOverlayModalProps> = ({
  isVisible,
  title,
  description,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Overlay>
        <ModalContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <TouchableOpacity onPress={onClose}>
            <CloseButton>Close</CloseButton>
          </TouchableOpacity>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

export default ErrorOverlayModal;
