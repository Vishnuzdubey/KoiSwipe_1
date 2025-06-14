import React from 'react';
import { StyleSheet, View, Text, Image, ViewStyle } from 'react-native';
import { Button } from './Button';
import colors from '@/constants/colors';

interface EmptyStateProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  imageUrl,
  buttonTitle,
  onButtonPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="contain"
        />
      )}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {buttonTitle && onButtonPress && (
        <Button 
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});