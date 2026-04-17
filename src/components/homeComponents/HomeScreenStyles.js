import { StyleSheet, Dimensions, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rideCard: {
    width: Dimensions.get('window').width - scale(32),
    backgroundColor: colors.white, borderRadius: moderateScale(16),
    padding: scale(16), marginHorizontal: scale(8),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
    borderWidth: 2, borderColor: colors.secondary,
  },
  rideCardMatch: { borderColor: colors.blue, backgroundColor: colors.background },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(12) },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.secondary, paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4), borderRadius: scale(12), gap: scale(4),
  },
  typeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontFamily: fonts.bold },
  passengerInfo: { flex: 1, marginLeft: scale(12) },
  passengerName: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: scale(4) },
  ratingText: { fontSize: moderateScale(12), color: colors.grey },
  fare: { fontSize: moderateScale(24), fontFamily: fonts.bold, color: colors.secondary },
  fareLabel: { fontSize: moderateScale(10), color: colors.grey },
  routeBox: {
    backgroundColor: colors.background2, borderRadius: moderateScale(12),
    padding: scale(12), marginBottom: verticalScale(12),
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: {
    width: scale(10), height: scale(10), borderRadius: scale(5),
    marginRight: scale(10), marginTop: scale(4),
  },
  routeLine: {
    width: scale(2), height: verticalScale(28),
    backgroundColor: colors.veryLightGrey, marginLeft: scale(4),
    marginVertical: verticalScale(4),
  },
  routeLabel: { fontSize: moderateScale(10), color: colors.grey, textTransform: 'uppercase' },
  routeAddress: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.secondary },
  routeMeta: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  routeMetaText: { fontSize: moderateScale(11), color: colors.grey },
  cardActions: { flexDirection: 'row', gap: scale(12) },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.veryLightGrey,
  },
  declineText: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.grey },
  acceptBtn: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.secondary,
  },
  acceptBtnMatch: { backgroundColor: colors.blue },
  acceptText: { fontSize: moderateScale(15), fontFamily: fonts.bold, color: colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24), borderTopRightRadius: moderateScale(24),
    paddingTop: verticalScale(16),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20),
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: scale(16), marginBottom: verticalScale(16),
  },
  modalTitle: { fontSize: moderateScale(20), fontFamily: fonts.bold, color: colors.secondary },
  modalSubtitle: { fontSize: moderateScale(13), color: colors.grey, marginTop: verticalScale(2) },
  modalCloseBtn: {
    width: scale(40), height: scale(40), borderRadius: scale(20),
    backgroundColor: colors.veryLightGrey, alignItems: 'center', justifyContent: 'center',
  },
  activeContainer: {
    position: 'absolute', top: verticalScale(100),
    left: scale(16), right: scale(16), zIndex: 10,
  },
  activeCard: {
    backgroundColor: colors.white, borderRadius: moderateScale(16), padding: scale(16),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
  },
  activeHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: verticalScale(12),
  },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.green, paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4), borderRadius: scale(12), gap: scale(4),
  },
  activeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontFamily: fonts.bold },
  activeStatus: { fontSize: moderateScale(13), color: colors.grey },
  activeRoute: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    marginBottom: verticalScale(12), padding: scale(12),
    backgroundColor: colors.background2, borderRadius: moderateScale(10),
  },
  activeAddress: { flex: 1, fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.secondary },
  activeActions: { flexDirection: 'row', gap: scale(12) },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.veryLightGrey,
  },
  cancelText: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.red },
  navigateBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.secondary,
  },
  navigateText: { fontSize: moderateScale(14), fontFamily: fonts.bold, color: colors.white },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-evenly', paddingVertical: verticalScale(12),
  },
  statCell: { alignItems: 'center', gap: verticalScale(4), flex: 1 },
  statValue: { fontSize: moderateScale(16), fontFamily: fonts.bold },
  statLabel: { fontSize: moderateScale(11), fontFamily: fonts.regular },
  statDivider: { width: 1, height: verticalScale(40) },
  cancelIconBox: {
    width: scale(22), height: scale(22), borderRadius: scale(6),
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center',
  },
  waitingContainer: {
    position: 'absolute', top: verticalScale(100),
    left: 0, right: 0, alignItems: 'center', zIndex: 10,
  },
  waitingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    paddingHorizontal: scale(16), paddingVertical: verticalScale(10),
    borderRadius: scale(24), backgroundColor: colors.white,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 5,
  },
  pulseDot: {
    width: scale(10), height: scale(10),
    borderRadius: scale(5), backgroundColor: colors.green,
  },
  navButton: {
    position: 'absolute',
    bottom: verticalScale(180),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
  },
  navButtonInner: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  navButtonText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginTop: verticalScale(4),
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
});

export default styles;
