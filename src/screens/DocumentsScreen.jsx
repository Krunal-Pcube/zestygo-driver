import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  FileText,
  ChevronRight,
  CheckCircle2,
  Camera,
  Upload,
  AlertCircle,
  Clock,
  Plus,
  X,
  FileUp,
  Image as ImageIcon,
} from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../context/ThemeContext';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const initialDocumentsData = [
  {
    id: 1,
    title: "Driver's License",
    description: 'Front and back of your valid license',
    status: 'verified',
    uploadProgress: 100,
    expiryDate: '2027-05-15',
    icon: 'license',
    required: true,
    uploadedImage: null,
  },
  {
    id: 2,
    title: 'Vehicle Registration',
    description: 'Current registration certificate',
    status: 'pending',
    uploadProgress: 100,
    submittedAt: '2024-04-10',
    icon: 'registration',
    required: true,
    uploadedImage: null,
  },
  {
    id: 3,
    title: 'Insurance Certificate',
    description: 'Valid commercial insurance',
    status: 'not_uploaded',
    uploadProgress: 0,
    icon: 'insurance',
    required: true,
    uploadedImage: null,
  },
  {
    id: 4,
    title: 'Background Check',
    description: 'Criminal record check',
    status: 'rejected',
    uploadProgress: 100,
    rejectionReason: 'Document unclear, please re-upload',
    icon: 'background',
    required: true,
    uploadedImage: null,
  },
  {
    id: 5,
    title: 'Profile Photo',
    description: 'Clear photo of your face',
    status: 'verified',
    uploadProgress: 100,
    icon: 'photo',
    required: true,
    uploadedImage: null,
  },
  {
    id: 6,
    title: 'Vehicle Inspection',
    description: 'Safety inspection certificate',
    status: 'not_uploaded',
    uploadProgress: 0,
    icon: 'inspection',
    required: false,
    uploadedImage: null,
  },
  {
    id: 7,
    title: 'Bank Account Details',
    description: 'For payment deposits',
    status: 'verified',
    uploadProgress: 100,
    icon: 'bank',
    required: true,
    uploadedImage: null,
  },
];

// ─── All statuses now use only primary / textSecondary / white ───────────────
const getStatusConfig = colors => status => {
  switch (status) {
    case 'verified':
      return {
        icon: CheckCircle2,
        color: colors.primary,
        bgColor: colors.primary + '20', // 12 % opacity tint
        label: 'Verified',
      };
    case 'pending':
      return {
        icon: Clock,
        color: colors.textSecondary,
        bgColor: colors.primary + '15', // lighter primary tint
        label: 'Under Review',
      };
    case 'rejected':
      return {
        icon: AlertCircle,
        color: colors.textSecondary,
        bgColor: colors.cardBackground,
        label: 'Action Required',
      };
    case 'not_uploaded':
    default:
      return {
        icon: Upload,
        color: colors.textSecondary,
        bgColor: colors.cardBackground,
        label: 'Upload Required',
      };
  }
};

// ─── Permission helper ────────────────────────────────────────────────────────
const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera to take document photos.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

// ─── Image Picker options ─────────────────────────────────────────────────────
const PICKER_OPTIONS = {
  mediaType: 'photo',
  quality: 0.8,
  includeBase64: false,
  saveToPhotos: false,
};

const DocumentsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const getStatus = getStatusConfig(colors);

  const [documents, setDocuments] = useState(initialDocumentsData);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ── Simulate upload after image is picked ──────────────────────────────────
  const simulateUpload = useCallback((docId, imageUri) => {
    setUploadingDocId(docId);
    setUploadModalVisible(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === docId ? { ...doc, uploadProgress: progress } : doc,
        ),
      );
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === docId
                ? {
                    ...doc,
                    status: 'pending',
                    uploadedImage: imageUri,
                    submittedAt: new Date().toISOString().split('T')[0],
                  }
                : doc,
            ),
          );
          setUploadingDocId(null);
        }, 500);
      }
    }, 300);
  }, []);

  // ── Take Photo ────────────────────────────────────────────────────────────
  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos. Please enable it in Settings.',
      );
      return;
    }

    launchCamera(PICKER_OPTIONS, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri && selectedDoc) {
        simulateUpload(selectedDoc.id, uri);
      }
    });
  }, [selectedDoc, simulateUpload]);

  // ── Choose from Gallery ───────────────────────────────────────────────────
  const handleChooseFromGallery = useCallback(() => {
    launchImageLibrary(PICKER_OPTIONS, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri && selectedDoc) {
        simulateUpload(selectedDoc.id, uri);
      }
    });
  }, [selectedDoc, simulateUpload]);

  // ── Card press ────────────────────────────────────────────────────────────
  const handleDocPress = useCallback(
    doc => {
      setSelectedDoc(doc);
      if (doc.status === 'not_uploaded' || doc.status === 'rejected') {
        setUploadModalVisible(true);
      } else if (doc.uploadedImage) {
        setPreviewImage(doc.uploadedImage);
        setPreviewModalVisible(true);
      } else {
        const { label } = getStatus(doc.status);
        Alert.alert(
          doc.title,
          [
            `Status: ${label}`,
            doc.expiryDate ? `Expires: ${doc.expiryDate}` : '',
            doc.submittedAt ? `Submitted: ${doc.submittedAt}` : '',
            doc.rejectionReason ? `Note: ${doc.rejectionReason}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          [
            { text: 'OK' },
            ...(doc.status === 'verified'
              ? [{ text: 'Update', onPress: () => setUploadModalVisible(true) }]
              : []),
          ],
        );
      }
    },
    [getStatus],
  );

  // ── Derived counts ────────────────────────────────────────────────────────
  const completedCount = documents.filter(d => d.status === 'verified').length;
  const requiredCount = documents.filter(d => d.required).length;
  const completionPercentage = Math.round((completedCount / requiredCount) * 100);

  // ── Render card ───────────────────────────────────────────────────────────
  const renderDocumentCard = doc => {
    const statusConfig = getStatus(doc.status);
    const StatusIcon = statusConfig.icon;
    const isUploading = uploadingDocId === doc.id;

    return (
      <TouchableOpacity
        key={doc.id}
        style={[
          styles.documentCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.divider },
        ]}
        activeOpacity={0.7}
        onPress={() => handleDocPress(doc)}>
        {/* Left Icon */}
        <View style={[styles.iconContainer, { backgroundColor: statusConfig.bgColor }]}>
          {doc.uploadedImage ? (
            <Image
              source={{ uri: doc.uploadedImage }}
              style={styles.thumbnailImage}
            />
          ) : (
            <FileText size={24} color={statusConfig.color} />
          )}
        </View>

        {/* Info */}
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: colors.textPrimary }]}>
            {doc.title}
          </Text>
          <Text style={[styles.documentDescription, { color: colors.textSecondary }]}>
            {doc.description}
          </Text>

          <View style={styles.statusRow}>
            <StatusIcon size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {isUploading ? 'Uploading...' : statusConfig.label}
            </Text>
            {doc.required && (
              <View style={[styles.requiredBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            )}
          </View>

          {isUploading && (
            <View style={[styles.progressBarContainer, { backgroundColor: colors.divider }]}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${doc.uploadProgress}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          )}

          {doc.rejectionReason && doc.status === 'rejected' && (
            <Text style={[styles.rejectionNote, { color: colors.textSecondary }]}>
              {doc.rejectionReason}
            </Text>
          )}
        </View>

        {/* Right action */}
        <View style={styles.actionContainer}>
          {doc.status === 'not_uploaded' || doc.status === 'rejected' ? (
            <View style={[styles.uploadBadge, { backgroundColor: colors.primary }]}>
              <Plus size={16} color="#FFF" />
            </View>
          ) : (
            <ChevronRight size={20} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Documents" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Progress header */}
        <View style={[styles.progressHeader, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.progressTextRow}>
            <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
              Document Verification
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {completionPercentage}%
            </Text>
          </View>

          <View style={[styles.mainProgressContainer, { backgroundColor: colors.divider }]}>
            <View
              style={[
                styles.mainProgressBar,
                { width: `${completionPercentage}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>

          <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
            {completedCount} of {requiredCount} required documents verified
          </Text>

          {completionPercentage < 100 && (
            <View
              style={[
                styles.warningBanner,
                { backgroundColor: colors.primary + '15' }, // subtle primary tint
              ]}>
              <AlertCircle size={16} color={colors.primary} />
              <Text style={[styles.warningText, { color: colors.primary }]}>
                Complete all required documents to start driving
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Required Documents
        </Text>
        {documents.filter(d => d.required).map(renderDocumentCard)}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Optional Documents
        </Text>
        {documents.filter(d => !d.required).map(renderDocumentCard)}
      </ScrollView>

      {/* ── Upload Modal ──────────────────────────────────────────────────── */}
      <Modal
        animationType="slide"
        transparent
        visible={uploadModalVisible}
        onRequestClose={() => setUploadModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Upload {selectedDoc?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setUploadModalVisible(false)}
                style={styles.closeButton}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {selectedDoc?.description}
            </Text>

            {/* Take Photo */}
            <TouchableOpacity
              style={[
                styles.uploadOption,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' },
              ]}
              onPress={handleTakePhoto}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary }]}>
                <Camera size={24} color="#FFF" />
              </View>
              <View style={styles.uploadOptionText}>
                <Text style={[styles.uploadOptionTitle, { color: colors.textPrimary }]}>
                  Take Photo
                </Text>
                <Text style={[styles.uploadOptionSubtitle, { color: colors.textSecondary }]}>
                  Use camera to capture document
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity
              style={[
                styles.uploadOption,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' },
              ]}
              onPress={handleChooseFromGallery}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary }]}>
                <ImageIcon size={24} color="#FFF" />
              </View>
              <View style={styles.uploadOptionText}>
                <Text style={[styles.uploadOptionTitle, { color: colors.textPrimary }]}>
                  Choose from Gallery
                </Text>
                <Text style={[styles.uploadOptionSubtitle, { color: colors.textSecondary }]}>
                  Select an existing photo
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Guidelines */}
            <View
              style={[
                styles.guidelinesCard,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' },
              ]}>
              <Text style={[styles.guidelinesTitle, { color: colors.textPrimary }]}>
                Photo Guidelines:
              </Text>
              {[
                'Ensure all text is clearly visible',
                'All 4 corners of the document in frame',
                'No glare or shadows on document',
                'Document must be current and valid',
              ].map((tip, index) => (
                <View key={index} style={styles.guidelineItem}>
                  <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Image Preview Modal ───────────────────────────────────────────── */}
      <Modal
        animationType="fade"
        transparent
        visible={previewModalVisible}
        onRequestClose={() => setPreviewModalVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewClose}
            onPress={() => setPreviewModalVisible(false)}>
            <X size={28} color="#FFF" />
          </TouchableOpacity>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={[styles.reUploadButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setPreviewModalVisible(false);
              setUploadModalVisible(true);
            }}>
            <FileUp size={18} color="#FFF" />
            <Text style={styles.reUploadText}>Re-upload</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: scale(32) },

  // Progress Header
  progressHeader: {
    margin: scale(16),
    padding: scale(16),
    borderRadius: scale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  progressTitle: { fontSize: moderateScale(16), fontFamily: fonts.semiBold },
  progressPercent: { fontSize: moderateScale(20), fontFamily: fonts.bold },
  mainProgressContainer: {
    height: scale(8),
    borderRadius: scale(4),
    overflow: 'hidden',
    marginBottom: scale(8),
  },
  mainProgressBar: { height: '100%', borderRadius: scale(4) },
  progressSubtitle: { fontSize: moderateScale(13), marginBottom: scale(12) },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: scale(8),
    gap: scale(8),
  },
  warningText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    flex: 1,
  },

  // Section
  sectionTitle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    marginHorizontal: scale(16),
    marginTop: scale(16),
    marginBottom: scale(8),
  },

  // Document Card
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(16),
    marginVertical: scale(6),
    padding: scale(12),
    borderRadius: scale(12),
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(10),
  },
  documentInfo: { flex: 1 },
  documentTitle: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    marginBottom: scale(2),
  },
  documentDescription: {
    fontSize: moderateScale(12),
    marginBottom: scale(6),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  statusText: { fontSize: moderateScale(12), fontFamily: fonts.medium },
  requiredBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    marginLeft: scale(4),
  },
  requiredText: {
    fontSize: moderateScale(10),
    fontFamily: fonts.bold,
    color: '#FFF',
  },
  progressBarContainer: {
    height: scale(4),
    borderRadius: scale(2),
    overflow: 'hidden',
    marginTop: scale(8),
  },
  progressBar: { height: '100%', borderRadius: scale(2) },
  rejectionNote: {
    fontSize: moderateScale(11),
    fontFamily: fonts.medium,
    marginTop: scale(4),
  },
  actionContainer: { marginLeft: scale(8) },
  uploadBadge: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Upload Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: scale(20),
    paddingBottom: scale(40),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  modalTitle: { fontSize: moderateScale(18), fontFamily: fonts.bold },
  closeButton: { padding: scale(4) },
  modalSubtitle: { fontSize: moderateScale(14), marginBottom: scale(20) },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(12),
  },
  uploadIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadOptionText: { flex: 1, marginLeft: scale(12) },
  uploadOptionTitle: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    marginBottom: scale(2),
  },
  uploadOptionSubtitle: { fontSize: moderateScale(12) },
  guidelinesCard: {
    padding: scale(16),
    borderRadius: scale(12),
    marginTop: scale(8),
  },
  guidelinesTitle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    marginBottom: scale(12),
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(8),
  },
  bullet: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginTop: scale(5),
    marginRight: scale(8),
  },
  guidelineText: {
    fontSize: moderateScale(12),
    flex: 1,
    lineHeight: moderateScale(18),
  },

  // Preview Modal
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: scale(50),
    right: scale(20),
    zIndex: 10,
    padding: scale(8),
  },
  previewImage: {
    width: '90%',
    height: '65%',
    borderRadius: scale(12),
  },
  reUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(24),
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(30),
  },
  reUploadText: {
    color: '#FFF',
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
  },
});

export default DocumentsScreen;