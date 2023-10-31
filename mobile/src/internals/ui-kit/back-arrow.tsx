import { useNavigation } from '@react-navigation/native';
import { FlexRowContainer, PressableContainer } from './container';
import { Ionicons } from '@expo/vector-icons';

const BackArrow = () => {
  const navigation = useNavigation();

  return (
    <FlexRowContainer
      mb="0px"
      align="flex-start"
      justifyContent="space-between"
    >
      <PressableContainer
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="ios-arrow-back-outline" size={18} color="black" />
      </PressableContainer>
    </FlexRowContainer>
  );
};

export default BackArrow;
