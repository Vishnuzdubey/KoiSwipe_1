import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface PlanFeature {
  icon: string;
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  discount?: string;
  popular?: boolean;
  features: PlanFeature[];
  description: string;
  color: [string, string];
}

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'recharge',
      name: 'First Recharge Plan',
      price: '₹50',
      period: 'one-time',
      features: [
        { icon: 'message-circle', text: 'Send unlimited messages to 3 matches', included: true },
        { icon: 'x', text: 'Unlimited messages', included: false },
        { icon: 'x', text: 'Unlimited likes', included: false },
        { icon: 'x', text: 'Profile boost', included: false },
        { icon: 'x', text: 'See who likes you', included: false },
      ],
      description: 'Perfect for new users to get started',
      color: ['#FFA6C9', '#FFB7D1'],
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₹199',
      period: 'month',
      features: [
        { icon: 'message-circle', text: 'Send unlimited messages to unlimited matches', included: true },
        { icon: 'heart', text: 'Send 60 likes in a day', included: true },
        { icon: 'message-square', text: 'Send 10 comments in a day', included: true },
        { icon: 'trending-up', text: '2x profile boost', included: true },
        { icon: 'x', text: 'See who likes you', included: false },
        { icon: 'x', text: 'Unlimited likes', included: false },
      ],
      description: 'Great for regular users',
      color: ['#8A6FDF', '#9B7FE8'],
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹400',
      period: 'month',
      originalPrice: '₹600',
      discount: '33% OFF',
      popular: true,
      features: [
        { icon: 'message-circle', text: 'Unlimited messages', included: true },
        { icon: 'heart', text: 'Unlimited likes in a day', included: true },
        { icon: 'message-square', text: 'Send 25 comments in a day', included: true },
        { icon: 'trending-up', text: '3x profile boost', included: true },
        { icon: 'eye', text: 'See who likes you', included: true },
        { icon: 'star', text: 'Priority support', included: true },
        { icon: 'shield', text: 'Advanced privacy controls', included: true },
      ],
      description: 'Best value for serious daters',
      color: ['#FF6B9D', '#8A6FDF'],
    },
  ];

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      setShowPaymentModal(true);
    }
  };

  const handlePayment = (method: string) => {
    setShowPaymentModal(false);
    Alert.alert(
      'Payment Processing',
      `Processing payment via ${method}. This feature will be implemented soon.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const PlanCard = ({ plan, isSelected }: { plan: PricingPlan; isSelected: boolean }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        isSelected && styles.selectedPlanCard,
        plan.popular && styles.popularPlanCard,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.popularBadgeGradient}
          >
            <MaterialIcons name="star" size={16} color="#FFF" />
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </LinearGradient>
        </View>
      )}

      <LinearGradient
        colors={isSelected ? plan.color : ['transparent', 'transparent']}
        style={[styles.planHeader, !isSelected && { backgroundColor: colors.card }]}
      >
        <View style={styles.planTitleContainer}>
          <Text style={[styles.planName, { color: isSelected ? '#FFF' : colors.text }]}>
            {plan.name}
          </Text>
          {plan.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{plan.discount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.planPrice, { color: isSelected ? '#FFF' : colors.text }]}>
            {plan.price}
          </Text>
          {plan.originalPrice && (
            <Text style={[styles.originalPrice, { color: isSelected ? 'rgba(255,255,255,0.7)' : colors.textLight }]}>
              {plan.originalPrice}
            </Text>
          )}
          <Text style={[styles.planPeriod, { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textLight }]}>
            /{plan.period}
          </Text>
        </View>
        
        <Text style={[styles.planDescription, { color: isSelected ? 'rgba(255,255,255,0.9)' : colors.textLight }]}>
          {plan.description}
        </Text>
      </LinearGradient>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            {feature.included ? (
              <Feather name="check-circle" size={20} color="#4CAF50" />
            ) : (
              <Feather name="x-circle" size={20} color="#F44336" />
            )}
            <Text style={[styles.featureText, { color: feature.included ? colors.text : colors.textLight }]}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <LinearGradient
            colors={plan.color}
            style={styles.selectedIndicatorGradient}
          >
            <Feather name="check" size={20} color="#FFF" />
          </LinearGradient>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Upgrade to Premium',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#8A6FDF', '#FFA6C9']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <MaterialIcons name="auto-awesome" size={60} color="#FFF" />
            <Text style={styles.heroTitle}>Unlock Your Love Story</Text>
            <Text style={styles.heroSubtitle}>
              Get unlimited access to find your perfect anime match
            </Text>
          </View>
        </LinearGradient>

        {/* Special Offer Banner */}
        <View style={styles.offerBanner}>
          <LinearGradient
            colors={['#FF6B9D', '#8A6FDF']}
            style={styles.offerBannerGradient}
          >
            <Ionicons name="flash" size={24} color="#FFF" />
            <View style={styles.offerText}>
              <Text style={styles.offerTitle}>Limited Time Offer!</Text>
              <Text style={styles.offerSubtitle}>Save up to 33% on Premium plans</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Free vs Premium Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Free vs Premium</Text>
          <View style={styles.comparisonGrid}>
            <View style={styles.comparisonColumn}>
              <Text style={styles.comparisonHeader}>Free</Text>
              <Text style={styles.comparisonItem}>• 5 likes per day</Text>
              <Text style={styles.comparisonItem}>• Limited messages</Text>
              <Text style={styles.comparisonItem}>• Basic matching</Text>
            </View>
            <View style={styles.comparisonColumn}>
              <Text style={styles.comparisonHeader}>Premium</Text>
              <Text style={[styles.comparisonItem, { color: colors.primary }]}>• Unlimited likes</Text>
              <Text style={[styles.comparisonItem, { color: colors.primary }]}>• Unlimited messages</Text>
              <Text style={[styles.comparisonItem, { color: colors.primary }]}>• See who likes you</Text>
              <Text style={[styles.comparisonItem, { color: colors.primary }]}>• Profile boost</Text>
            </View>
          </View>
        </View>

        {/* Special Note for Girls */}
        <View style={styles.specialNote}>
          <LinearGradient
            colors={['#FFA6C9', '#FFB7D1']}
            style={styles.specialNoteGradient}
          >
            <MaterialIcons name="favorite" size={24} color="#FFF" />
            <Text style={styles.specialNoteText}>
              Girls can send unlimited messages to unlimited matches on free plan
            </Text>
          </LinearGradient>
        </View>

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
            />
          ))}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <LinearGradient
                colors={['#8A6FDF', '#FFA6C9']}
                style={styles.benefitIcon}
              >
                <MaterialIcons name="favorite-border" size={24} color="#FFF" />
              </LinearGradient>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Unlimited Likes</Text>
                <Text style={styles.benefitDescription}>Like as many profiles as you want</Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <LinearGradient
                colors={['#FF6B9D', '#8A6FDF']}
                style={styles.benefitIcon}
              >
                <MaterialIcons name="visibility" size={24} color="#FFF" />
              </LinearGradient>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>See Who Likes You</Text>
                <Text style={styles.benefitDescription}>Know who's interested before you swipe</Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <LinearGradient
                colors={['#FFA6C9', '#FFB7D1']}
                style={styles.benefitIcon}
              >
                <MaterialIcons name="rocket-launch" size={24} color="#FFF" />
              </LinearGradient>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Profile Boost</Text>
                <Text style={styles.benefitDescription}>Be seen by more people in your area</Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <LinearGradient
                colors={['#8A6FDF', '#9B7FE8']}
                style={styles.benefitIcon}
              >
                <MaterialIcons name="priority-high" size={24} color="#FFF" />
              </LinearGradient>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Priority Support</Text>
                <Text style={styles.benefitDescription}>Get faster help when you need it</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Subscribe Button */}
      <View style={styles.subscribeContainer}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <LinearGradient
            colors={plans.find(p => p.id === selectedPlan)?.color || ['#8A6FDF', '#FFA6C9']}
            style={styles.subscribeButtonGradient}
          >
            <Text style={styles.subscribeButtonText}>
              Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
            </Text>
            <Text style={styles.subscribeButtonPrice}>
              {plans.find(p => p.id === selectedPlan)?.price}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.subscribeNote}>
          Cancel anytime. No hidden fees.
        </Text>
      </View>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>Choose Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => handlePayment('UPI')}
              >
                <MaterialIcons name="account-balance-wallet" size={32} color={colors.primary} />
                <Text style={styles.paymentMethodText}>UPI Payment</Text>
                <Feather name="chevron-right" size={20} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => handlePayment('Card')}
              >
                <MaterialIcons name="credit-card" size={32} color={colors.primary} />
                <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
                <Feather name="chevron-right" size={20} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => handlePayment('Net Banking')}
              >
                <MaterialIcons name="account-balance" size={32} color={colors.primary} />
                <Text style={styles.paymentMethodText}>Net Banking</Text>
                <Feather name="chevron-right" size={20} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => handlePayment('Wallet')}
              >
                <MaterialIcons name="account-balance-wallet" size={32} color={colors.primary} />
                <Text style={styles.paymentMethodText}>Digital Wallet</Text>
                <Feather name="chevron-right" size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentSecurity}>
              <MaterialIcons name="security" size={20} color="#4CAF50" />
              <Text style={styles.securityText}>Your payment is secure and encrypted</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  offerBanner: {
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  offerBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  offerText: {
    marginLeft: 12,
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  comparisonSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  comparisonGrid: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comparisonColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  comparisonHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonItem: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  specialNote: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  specialNoteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  specialNoteText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  plansSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  planCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: 'relative',
  },
  selectedPlanCard: {
    borderWidth: 3,
    borderColor: colors.primary,
    elevation: 8,
    shadowOpacity: 0.25,
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  popularBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 4,
  },
  planHeader: {
    padding: 24,
    paddingTop: 32,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  planPeriod: {
    fontSize: 18,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 16,
  },
  featuresContainer: {
    padding: 24,
    paddingTop: 0,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedIndicatorGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  benefitsList: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  benefitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  subscribeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  subscribeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
  },
  subscribeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  subscribeButtonPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subscribeNote: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: 16,
  },
  paymentSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.success}20`,
    padding: 12,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
    marginLeft: 8,
  },
});
