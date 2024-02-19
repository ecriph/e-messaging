import React from 'react';
import {
  FlexColumnContainer,
  FlexRowContainer,
  MainContainer,
} from '../../../../internals/ui-kit/container';
import { HeaderText2 } from '../../../../internals/ui-kit/text';
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import { Font } from '../../../../internals/ui-kit/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useChatMedia } from '../chat-hooks/use-chat-media';

type Props = {
  onClick: () => void;
  onSaveUrl: (url: string) => void;
};

const DATA = [
  {
    name: 'Photo',
    image: <FontAwesome name="photo" size={24} color="black" />,
    type: 'image',
  },
  {
    name: 'Video',
    image: <Entypo name="video" size={24} color="black" />,
    type: 'video',
  },
  {
    name: 'Audio',
    image: <MaterialIcons name="multitrack-audio" size={24} color="black" />,
    type: 'audio',
  },
];

export const ChatAttachment = ({ onClick, onSaveUrl }: Props) => {
  const { handleMedia } = useChatMedia({
    onSucess(url) {
      onClick();
      onSaveUrl(url);
    },
  });
  const onSucess = (url: string) => {
    onClick();
  };
  return (
    <MainContainer>
      <FlexColumnContainer mt="10px">
        <FlexRowContainer justifyContent="space-between" align="center">
          <HeaderText2 font={Font.SemiBold}>Select media:</HeaderText2>
          <AntDesign name="close" size={18} color="black" onPress={onClick} />
        </FlexRowContainer>
        <FlexRowContainer justifyContent="space-between" mt="60px">
          {DATA.map((data, i) => (
            <TouchableOpacity onPress={() => handleMedia(data.type)} key={i}>
              <FlexColumnContainer align="center">
                {data.image}
                <HeaderText2 fontSize={12}>{data.name}</HeaderText2>
              </FlexColumnContainer>
            </TouchableOpacity>
          ))}
        </FlexRowContainer>
      </FlexColumnContainer>
    </MainContainer>
  );
};
