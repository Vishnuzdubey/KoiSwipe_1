import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsScreen() {
  const {
    language,
    isDarkMode,
    notificationsEnabled,
    toggleDarkMode,
    toggleNotifications
  } = useAppStore();

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigate to auth screen after successful logout
              router.replace('/auth/auth');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Bell icon */}
              <Feather name="bell" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Receive match and message alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Moon icon */}
              <Feather name="moon" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Switch to dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Globe icon */}
              <Feather name="globe" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>{language.name}</Text>
            </View>
            {/* ChevronRight icon */}
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Shield icon */}
              <Feather name="shield" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>Manage your data and privacy settings</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Bell icon */}
              <Feather name="bell" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingDescription}>Customize notification preferences</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Shield icon */}
              <Feather name="shield" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Blocked Users</Text>
              <Text style={styles.settingDescription}>Manage your blocked list</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* HelpCircle icon */}
              <Feather name="help-circle" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>Get help with OtakuMatch</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {/* Info icon */}
              <Feather name="info" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>About</Text>
              <Text style={styles.settingDescription}>App version and information</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dangerButton: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: `${colors.error}20`,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
});