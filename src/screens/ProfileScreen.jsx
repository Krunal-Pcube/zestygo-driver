import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { ArrowLeft, Pencil, X } from 'lucide-react-native';
import ActionButton from '../components/common/ActionButton';
import AcceptenceIcon from '../assets/homeIcons/acceptence.svg';
import RatingIcon from '../assets/homeIcons/rating.svg';
import CancellationIcon from '../assets/homeIcons/cancellation.svg';
import { colors } from '../utils/colors'; 
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';

const profileData = {
  firstName: 'James',
  lastName: 'Smith',
  phone: '+251 455 222 22',
  email: 'james.smith34@gmail.com',
  rating: 4.89,
  trips: 3250,
  years: 2.5,
  acceptance: 98,
  cancellation: 2,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
};

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    phone: profileData.phone,
    email: profileData.email,
  });

  const scrollViewRef = useRef(null);
  const infoSectionRef = useRef(null);

  const handleEditPress = () => {
    setIsEditing(true);
    // Measure infoSection position and scroll to it
    setTimeout(() => {
      infoSectionRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - scale(16), animated: true });
        },
        () => {}
      );
    }, 100);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      email: profileData.email,
    });
    setIsEditing(false);
  };

  const InfoRow = ({ label, field, keyboardType = 'default' }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.infoInput}
          value={form[field]}
          onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
          keyboardType={keyboardType}
          autoCapitalize="none"
          placeholderTextColor={colors.mediumGrey}
        />
      ) : (
        <Text style={styles.infoValue}>{form[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : scale(20)}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Dark Header Bar ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.7}
            onPress={isEditing ? handleCancel : handleEditPress}
          >
            {isEditing
              ? <X size={20} color={colors.white} strokeWidth={2.5} />
              : <Pencil size={20} color={colors.white} strokeWidth={2.5} />
            }
          </TouchableOpacity>
        </View>

        {/* ── Avatar Card ── */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            <View style={styles.ratingBadge}>
              <RatingIcon width={moderateScale(10)} height={moderateScale(10)} fill={colors.white} />
              <Text style={styles.ratingText}>{profileData.rating}</Text>
            </View>
          </View>

          <Text style={styles.name}>
            {form.firstName} {form.lastName}
          </Text>

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

          <View style={[styles.statsRow, styles.secondaryStatsRow]}>
            <View style={styles.statItem}>
              <AcceptenceIcon width={moderateScale(20)} height={moderateScale(20)} fill={colors.dark} />
              <Text style={styles.statValue}>{profileData.acceptance}%</Text>
              <Text style={styles.statLabel}>Acceptance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <RatingIcon width={moderateScale(20)} height={moderateScale(20)} fill={colors.dark} />
              <Text style={styles.statValue}>{profileData.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <CancellationIcon width={moderateScale(20)} height={moderateScale(20)} fill={colors.dark} />
              <Text style={styles.statValue}>{profileData.cancellation}%</Text>
              <Text style={styles.statLabel}>Cancellation</Text>
            </View>
          </View>
        </View>

        {/* ── Personal Info Section ── */}
        <View
          ref={infoSectionRef}
          style={styles.infoSection}
        >
          <Text style={styles.sectionTitle}>Personal Info :</Text>
          <InfoRow label="First name :"   field="firstName" />
          <InfoRow label="Last name :"    field="lastName" />
          <InfoRow label="Phone number :" field="phone"     keyboardType="phone-pad" />
          <InfoRow label="Email :"        field="email"     keyboardType="email-address" />
        </View>

        {/* ── Update Button ── */}
        {isEditing && (
          <View style={styles.updateWrapper}>
            <ActionButton
              title="Update Profile"
              onPress={handleSave}
              variant="secondary"
            />
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// styles unchanged from before

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  scrollContent: { paddingBottom: scale(40) },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(50),
    backgroundColor: colors.secondary,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

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
    marginTop: -scale(36),
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
    fontFamily: fonts.bold,
  },
  name: {
    fontSize: moderateScale(19),
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
  secondaryStatsRow: {
    borderTopWidth: 0,
    marginTop: -scale(10),
    paddingBottom: scale(14),
  },

  // ── Info Section ──────────────────────────────────────────────────────────
  infoSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.bold,
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
    fontFamily: fonts.medium,
  },
  infoInput: {
    fontSize: moderateScale(15),
    color: colors.dark,
    fontFamily: fonts.medium,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingVertical: scale(2),
    paddingHorizontal: 0,
  },

  // ── Update Button ─────────────────────────────────────────────────────────
  updateWrapper: {
    paddingHorizontal: scale(20),
    marginTop: scale(16),
  },
});

export default ProfileScreen;