import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabButton from './TabButton';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  return (

          <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
              {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const label =
                      options.tabBarLabel !== undefined
                          ? options.tabBarLabel
                          : options.title !== undefined
                              ? options.title
                              : route.name;

                  const isFocused = state.index === index;

                  const onPress = () => {
                      const event = navigation.emit({
                          type: 'tabPress',
                          target: route.key,
                          canPreventDefault: true,
                      });

                      if (!isFocused && !event.defaultPrevented) {
                          navigation.navigate(route.name);
                      }
                  };

                  return (
                      <TabButton
                          key={route.key}
                          label={typeof label === 'string' ? label : route.name}
                          onPress={onPress}
                          isFocused={isFocused}
                      />
                  );
              })}
          </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',

  },
  container: {
    flexDirection: 'row',
      position: 'absolute',
      bottom: 0,

      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
      marginBottom:15,
    shadowColor: '#000',
    borderRadius:250,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
      zIndex: 10,                     // ✅ Ensures it floats above content

  },
});