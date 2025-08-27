import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface TabButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, onPress, isFocused }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isFocused && styles.activeButton,
        pressed && styles.pressedButton,
      ]}
    >
      <Text style={[
        styles.label,
        isFocused && styles.activeLabel,
      ]}>
        {label}
      </Text>
      {isFocused && <Text style={styles.indicator}>●</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 127, 80, 0.1)',
  },
  pressedButton: {
    backgroundColor: 'rgba(255, 127, 80, 0.05)',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  activeLabel: {
    color: '#ff7f50',
    fontWeight: '500',
      borderRadius:250,

  },
  indicator: {
    fontSize: 8,
    color: '#ff7f50',

      position: 'absolute',
    bottom: 8,
  },
});

export default TabButton;