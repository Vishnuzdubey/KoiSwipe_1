import colors from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface InteractiveLoaderProps {
  message?: string;
  submessage?: string;
}

export const InteractiveLoader: React.FC<InteractiveLoaderProps> = ({
  message = "Finding your perfect anime match...",
  submessage = "This might take a moment ✨"
}) => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heartBeat = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Heart beat animation - faster and more pronounced
    const heartAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeat, {
          toValue: 1.4,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeat, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeat, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeat, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );

    // Float animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Sparkle animation
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    heartAnimation.start();
    floatAnimation.start();
    sparkleAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      heartAnimation.stop();
      floatAnimation.stop();
      sparkleAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background sparkles */}
      <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity }]}>
        <Text style={styles.sparkleText}>✨</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity }]}>
        <Text style={styles.sparkleText}>💫</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity }]}>
        <Text style={styles.sparkleText}>⭐</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkle4, { opacity: sparkleOpacity }]}>
        <Text style={styles.sparkleText}>🌟</Text>
      </Animated.View>

      {/* Main loader content */}
      <View style={styles.content}>
        {/* Animated main icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: pulseAnim },
                { translateY: floatAnim },
              ],
            },
          ]}
        >
          <View style={styles.iconBackground}>
            <Feather name="heart" size={60} color={colors.primary} />
          </View>
        </Animated.View>

        {/* Animated beating heart */}
        <Animated.View
          style={[
            styles.heartContainer,
            {
              transform: [{ scale: heartBeat }],
            },
          ]}
        >
          <Text style={styles.heartEmoji}>💖</Text>
        </Animated.View>

        {/* Loading text */}
        <Text style={styles.loadingText}>{message}</Text>
        <Text style={styles.subText}>{submessage}</Text>

        {/* Animated dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <AnimatedDot key={index} delay={index * 200} />
          ))}
        </View>

        {/* Progress rings */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressRing,
              styles.ring1,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.progressRing,
              styles.ring2,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
        </View>

        {/* Fun tip */}
        <View style={styles.tipContainer}>
          <Feather name="info" size={16} color={colors.textLight} />
          <Text style={styles.tipText}>
            Tip: Swipe up for Super Like! ⭐
          </Text>
        </View>
      </View>
    </View>
  );
};

// Animated dot component
const AnimatedDot: React.FC<{ delay: number }> = ({ delay }) => {
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: dotAnim,
          transform: [
            {
              scale: dotAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '40',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heartContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  heartEmoji: {
    fontSize: 24,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  progressContainer: {
    position: 'absolute',
    top: -40,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: 'transparent',
  },
  ring1: {
    width: 160,
    height: 160,
    borderTopColor: colors.primary + '60',
    borderRightColor: colors.primary + '40',
  },
  ring2: {
    width: 180,
    height: 180,
    borderBottomColor: colors.secondary + '60',
    borderLeftColor: colors.secondary + '40',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.2,
    left: width * 0.1,
  },
  sparkle2: {
    top: height * 0.3,
    right: width * 0.15,
  },
  sparkle3: {
    bottom: height * 0.3,
    left: width * 0.2,
  },
  sparkle4: {
    bottom: height * 0.2,
    right: width * 0.1,
  },
  sparkleText: {
    fontSize: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    fontStyle: 'italic',
  },
});