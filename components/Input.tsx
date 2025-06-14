import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  isPassword = false,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderPasswordIcon = () => {
    if (!isPassword) return null;
    
    return (
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconContainer}>
        {secureTextEntry ? (
          <Feather name="eye-off" size={20} color={colors.textLight} />
        ) : (
          <Feather name="eye" size={20} color={colors.textLight} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 8 } : null,
            (rightIcon || isPassword) ? { paddingRight: 8 } : null,
            inputStyle,
          ]}
          placeholderTextColor={colors.textLight}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        
        {renderPasswordIcon() || (rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>)}
      </View>
      
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});