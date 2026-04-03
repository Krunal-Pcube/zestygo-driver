import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, StatusBar,
} from 'react-native';
import { ArrowLeft, Pencil, Star, Save } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';

const profileData = {
  firstName: 'James',
  lastName: 'Smith',
  phone: '+251 455 222 22',
  email: 'james.smith34@gmail.com',
  rating: 4.89,
  trips: 3250,
  years: 2.5,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* ── Dark Header Bar ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Pencil size={20} color={colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Card (overlaps header) ── */}
        <View style={styles.avatarCard}>

          {/* Avatar + rating badge */}
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            <View style={styles.ratingBadge}>
              <Star size={10} color={colors.white} fill={colors.white} />
              <Text style={styles.ratingText}>{profileData.rating}</Text>
            </View>
          </View>

          <Text style={styles.name}>
            {profileData.firstName} {profileData.lastName}
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.trips}</Text>
              <Text style={styles.statLabel}>Trip</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.years}</Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
          </View>

        </View>

        {/* ── Personal Info Section ── */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Info :</Text>
          <InfoRow label="First name :"     value={profileData.firstName} />
          <InfoRow label="Last name :"      value={profileData.lastName} />
          <InfoRow label="Phone number :"   value={profileData.phone} />
          <InfoRow label="Email :"          value={profileData.email} />
        </View>

        {/* ── Update Button ── */}
        <View style={styles.updateWrapper}>
          <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85}>
            <Save size={18} color={colors.secondary} strokeWidth={2.5} />
            <Text style={styles.updateBtnText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(50),          // extra bottom so card overlaps nicely
    backgroundColor: colors.secondary,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollView: { flex: 1, marginTop: -scale(36) },
  scrollContent: { paddingBottom: scale(40) },

  // ── Avatar Card ───────────────────────────────────────────────────────────
  avatarCard: {
    backgroundColor: colors.white,
    marginHorizontal: scale(16),
    borderRadius: scale(16),
    alignItems: 'center',
    paddingTop: scale(20),
    paddingBottom: scale(0),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: scale(24),
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: scale(10),
  },
  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    borderWidth: 3,
    borderColor: colors.white,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -scale(2),
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -scale(18) }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange,
    paddingHorizontal: scale(7),
    paddingVertical: scale(2),
    borderRadius: scale(12),
    gap: 3,
  },
  ratingText: {
    color: colors.white,
    fontSize: moderateScale(11),
    fontWeight: '700',
  },

  name: {
    fontSize: moderateScale(19),
    fontWeight: '700',
    color: colors.dark,
    marginBottom: scale(16),
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingVertical: scale(14),
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: colors.mediumGrey,
  },
  statDivider: {
    width: 1, height: scale(30),
    backgroundColor: colors.divider,
    alignSelf: 'center',
  },

  // ── Info Section ──────────────────────────────────────────────────────────
  infoSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.dark,
    marginBottom: scale(4),
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: scale(12),
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: colors.mediumGrey,
    marginBottom: scale(3),
  },
  infoValue: {
    fontSize: moderateScale(15),
    color: colors.dark,
    fontWeight: '500',
  },

  // ── Update Button ─────────────────────────────────────────────────────────
  updateWrapper: {
    paddingHorizontal: scale(20),
    marginTop: scale(16),
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: scale(16),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 7,
  },
  updateBtnText: {
    color: colors.secondary,
    fontSize: moderateScale(15),
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});

export default ProfileScreen;