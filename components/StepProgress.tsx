import colors from '@/constants/colors';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  animatedValue: Animated.Value;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  animatedValue,
}) => {
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${(currentStep / totalSteps) * 100}%`],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              index < currentStep && styles.stepCompleted,
              index === currentStep - 1 && styles.stepActive,
            ]}
          >
            <View style={styles.stepInner} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepActive: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
    transform: [{ scale: 1.2 }],
  },
  stepInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
});
