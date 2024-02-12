// useModal.js
import { useState, useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Keyboard } from 'react-native';

const useModal = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [openIndex, setIndex] = useState(1);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleClick = useCallback((index: number) => {
    if (index === -1) {
      handleCloseModal();
    }
  }, []);

  const handlePresentModalOpen = useCallback((index: number) => {
    sheetRef.current?.present();
    Keyboard.dismiss();
    setIndex(index);
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    sheetRef.current?.close();
    setOpen(false);
  }, []);

  return {
    isOpen,
    sheetRef,
    openIndex,
    handleClick,
    handlePresentModalOpen,
    handleCloseModal,
  };
};

export default useModal;
