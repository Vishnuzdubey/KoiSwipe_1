import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '../constants/colors';
import { useAppStore } from '../store/app-store';
import { useAuthStore } from '../store/auth-store';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  iconColor?: string;
}

export default function SettingsScreen() {
  const {
    language,
    isDarkMode,
    toggleDarkMode,
  } = useAppStore();

  const { logout } = useAuthStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);

  const handlePremiumUpgrade = () => {
    Alert.alert('Premium', 'Premium features coming soon!');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/auth');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          }
        }
      ]
    );
  };

  const SettingItem: React.FC<SettingItemProps> = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    iconColor = colors.primary 
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Feather name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Feather name="chevron-right" size={20} color={colors.textLight} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Premium Upgrade Section */}
        <View style={styles.premiumSection}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.premiumCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.premiumContent}>
              <MaterialIcons name="star" size={28} color="#FFF" />
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock unlimited likes, super likes & more!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.premiumButton} onPress={handlePremiumUpgrade}>
              <Text style={styles.premiumButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            icon="user"
            title="Edit Profile"
            subtitle="Update your photos and info"
            onPress={() => router.push('/preferences')}
          />
          
          <SettingItem
            icon="settings"
            title="Preferences"
            subtitle="Age range, distance, and more"
            onPress={() => router.push('/preferences')}
          />
          
          <SettingItem
            icon="shield"
            title="Privacy & Safety"
            subtitle="Control your visibility and safety"
          />
          
          <SettingItem
            icon="credit-card"
            title="Payment & Billing"
            subtitle="Manage subscriptions and payments"
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon="bell"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            rightComponent={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={pushNotifications ? colors.primary : colors.textLight}
              />
            }
          />
          
          <SettingItem
            icon="message-circle"
            title="Messages"
            subtitle="New message notifications"
            rightComponent={
              <Switch
                value={messageNotifications}
                onValueChange={setMessageNotifications}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={messageNotifications ? colors.primary : colors.textLight}
              />
            }
          />
          
          <SettingItem
            icon="heart"
            title="New Matches"
            subtitle="When someone likes you back"
            rightComponent={
              <Switch
                value={matchNotifications}
                onValueChange={setMatchNotifications}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={matchNotifications ? colors.primary : colors.textLight}
              />
            }
          />
        </View>

        {/* Discovery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery</Text>
          
          <SettingItem
            icon="map-pin"
            title="Location"
            subtitle="Enable location services"
            rightComponent={
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={locationServices ? colors.primary : colors.textLight}
              />
            }
          />
          
          <SettingItem
            icon="eye"
            title="Show me on KoiSwipe"
            subtitle="Control your profile visibility"
            rightComponent={
              <Switch
                value={showOnline}
                onValueChange={setShowOnline}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={showOnline ? colors.primary : colors.textLight}
              />
            }
          />
          
          <SettingItem
            icon="user-x"
            title="Private Mode"
            subtitle="Only people you like can see you"
            rightComponent={
              <Switch
                value={privateMode}
                onValueChange={setPrivateMode}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={privateMode ? colors.primary : colors.textLight}
              />
            }
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={isDarkMode ? colors.primary : colors.textLight}
              />
            }
          />
          
          <SettingItem
            icon="globe"
            title="Language"
            subtitle={language?.name || 'English'}
          />
          
          <SettingItem
            icon="download"
            title="Data Usage"
            subtitle="Manage data and storage"
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon="help-circle"
            title="Help Center"
            subtitle="Get help and support"
          />
          
          <SettingItem
            icon="message-square"
            title="Contact Us"
            subtitle="Send feedback or report issues"
          />
          
          <SettingItem
            icon="star"
            title="Rate KoiSwipe"
            subtitle="Share your experience"
          />
          
          <SettingItem
            icon="info"
            title="About"
            subtitle="App version and information"
          />
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <SettingItem
            icon="file-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
          />
          
          <SettingItem
            icon="shield"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
          />
          
          <SettingItem
            icon="book-open"
            title="Community Guidelines"
            subtitle="Rules for a safe community"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color={colors.primary} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Feather name="trash-2" size={20} color={colors.error} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  premiumSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  premiumCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumText: {
    marginLeft: 12,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.error}10`,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.error}20`,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
});
