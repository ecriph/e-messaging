import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

interface TabViewProps {
  isActive: boolean;
}

const TabWrapper = styled.View`
  flex-direction: row;
  background-color: #333;
`;

const TabItem = styled.View<TabViewProps>`
  flex: 1;
  align-items: center;
  padding: 10px;
  background-color: ${({ isActive }) => (isActive ? 'blue' : 'transparent')};
`;

const TabText = styled.Text<TabViewProps>`
  color: ${({ isActive }) => (isActive ? 'white' : 'gray')};
`;
const TabContent = styled.View`
  padding: 20px;
`;

const Tab = ({
  tabs,
  activeTab,
  onChangeTab,
  Content,
}: {
  tabs: string[];
  activeTab: number;
  onChangeTab: (index: number) => void;
  Content: React.ReactNode;
}) => {
  return (
    <TabWrapper>
      {tabs.map((tab, index: number) => (
        <TouchableOpacity key={index} onPress={() => onChangeTab(index)}>
          <TabItem isActive={index === activeTab}>
            <TabText isActive={index === activeTab}>{tab}</TabText>
          </TabItem>
        </TouchableOpacity>
      ))}
      <TabContent>
        {tabs.map((tab, index) => (
          <View
            key={index}
            style={{ display: index === activeTab ? 'flex' : 'none' }}
          >
            {index === activeTab && Content}
          </View>
        ))}
      </TabContent>
    </TabWrapper>
  );
};

export default Tab;
