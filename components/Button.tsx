import colors from '@/constants/colors';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textButtonText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              textStyle,
              (leftIcon || rightIcon) ? { marginHorizontal: 8 } : undefined
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.3,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  outlineText: {
    color: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  textButtonText: {
    color: colors.primary,
  },
  // Sizes
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  smallText: {
    fontSize: 14,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  mediumText: {
    fontSize: 16,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  largeText: {
    fontSize: 18,
  },
  // States
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  disabledText: {
    opacity: 0.8,
  },
});