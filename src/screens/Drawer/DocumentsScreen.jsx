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
  TextInput,
  KeyboardAvoidingView,
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
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../../components/Header';

// ─── Document field definitions ───────────────────────────────────────────────
const DOCUMENT_FIELDS = {
  license: [
    { key: 'licenseNumber', label: 'License Number', placeholder: 'e.g. DL-1234567890', keyboardType: 'default' },
    { key: 'expiryDate',    label: 'Expiry Date',     placeholder: 'DD/MM/YYYY',         keyboardType: 'default' },
    { key: 'dateOfBirth',   label: 'Date of Birth',   placeholder: 'DD/MM/YYYY',         keyboardType: 'default' },
  ],
  registration: [
    { key: 'regNumber',     label: 'Registration Number', placeholder: 'e.g. GJ-01-AA-1234', keyboardType: 'default' },
    { key: 'expiryDate',    label: 'Valid Until',          placeholder: 'DD/MM/YYYY',          keyboardType: 'default' },
    { key: 'vehicleModel',  label: 'Vehicle Model',        placeholder: 'e.g. Swift Dzire',    keyboardType: 'default' },
  ],
  insurance: [
    { key: 'policyNumber',  label: 'Policy Number',   placeholder: 'e.g. POL-9876543',  keyboardType: 'default' },
    { key: 'provider',      label: 'Insurance Provider', placeholder: 'e.g. Bajaj Allianz', keyboardType: 'default' },
    { key: 'expiryDate',    label: 'Expiry Date',      placeholder: 'DD/MM/YYYY',        keyboardType: 'default' },
  ],
  background: [
    { key: 'referenceNo',   label: 'Reference Number', placeholder: 'e.g. BGC-00123456', keyboardType: 'default' },
    { key: 'issuedBy',      label: 'Issued By',         placeholder: 'e.g. Police Dept',  keyboardType: 'default' },
  ],
  photo: [],   // image only
  inspection: [
    { key: 'certNumber',    label: 'Certificate Number', placeholder: 'e.g. INSP-20241234', keyboardType: 'default' },
    { key: 'inspectionDate',label: 'Inspection Date',    placeholder: 'DD/MM/YYYY',          keyboardType: 'default' },
    { key: 'issuedBy',      label: 'Issued By',           placeholder: 'e.g. RTO Office',    keyboardType: 'default' },
  ],
  bank: [
    { key: 'accountNumber', label: 'Account Number',   placeholder: 'Enter account number', keyboardType: 'numeric' },
    { key: 'ifscCode',      label: 'IFSC Code',         placeholder: 'e.g. SBIN0001234',     keyboardType: 'default' },
    { key: 'bankName',      label: 'Bank Name',          placeholder: 'e.g. State Bank of India', keyboardType: 'default' },
    { key: 'accountHolder', label: 'Account Holder Name', placeholder: 'Full name as per bank', keyboardType: 'default' },
  ],
};

// ─── Initial documents — all NOT uploaded ─────────────────────────────────────
const initialDocumentsData = [
  {
    id: 1, title: "Driver's License",      description: 'Front and back of your valid license',
    status: 'not_uploaded', uploadProgress: 0, icon: 'license',      required: true,  uploadedImage: null, fieldValues: {},
  },
  {
    id: 2, title: 'Vehicle Registration',  description: 'Current registration certificate',
    status: 'not_uploaded', uploadProgress: 0, icon: 'registration', required: true,  uploadedImage: null, fieldValues: {},
  },
  {
    id: 3, title: 'Insurance Certificate', description: 'Valid commercial insurance',
    status: 'not_uploaded', uploadProgress: 0, icon: 'insurance',    required: true,  uploadedImage: null, fieldValues: {},
  },
  {
    id: 4, title: 'Background Check',      description: 'Criminal record check',
    status: 'not_uploaded', uploadProgress: 0, icon: 'background',   required: true,  uploadedImage: null, fieldValues: {},
  },
  {
    id: 5, title: 'Profile Photo',         description: 'Clear photo of your face',
    status: 'not_uploaded', uploadProgress: 0, icon: 'photo',        required: true,  uploadedImage: null, fieldValues: {},
  },
  {
    id: 6, title: 'Vehicle Inspection',    description: 'Safety inspection certificate',
    status: 'not_uploaded', uploadProgress: 0, icon: 'inspection',   required: false, uploadedImage: null, fieldValues: {},
  },
  {
    id: 7, title: 'Bank Account Details',  description: 'For payment deposits',
    status: 'not_uploaded', uploadProgress: 0, icon: 'bank',         required: true,  uploadedImage: null, fieldValues: {},
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const getStatusConfig = colors => status => {
  switch (status) {
    case 'verified':
      return { icon: CheckCircle2, color: colors.secondary, bgColor: colors.secondary + '20', label: 'Verified' };
    case 'pending':
      return { icon: Clock,        color: colors.textSecondary, bgColor: colors.secondary + '15', label: 'Under Review' };
    case 'rejected':
      return { icon: AlertCircle,  color: colors.textSecondary, bgColor: colors.cardBackground, label: 'Action Required' };
    case 'not_uploaded':
    default:
      return { icon: Upload,       color: colors.textSecondary, bgColor: colors.cardBackground, label: 'Upload Required' };
  }
};

// ─── Camera permission ────────────────────────────────────────────────────────
const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'App needs access to your camera to take document photos.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch { return false; }
};

const PICKER_OPTIONS = { mediaType: 'photo', quality: 0.8, includeBase64: false, saveToPhotos: false };

// ─── Validate that required fields are filled ──────────────────────────────────
const validateFields = (iconKey, fieldValues) => {
  const fields = DOCUMENT_FIELDS[iconKey] || [];
  return fields.every(f => fieldValues[f.key]?.trim?.());
};

// ─────────────────────────────────────────────────────────────────────────────
const DocumentsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const getStatus = getStatusConfig(colors);

  const [documents,            setDocuments]            = useState(initialDocumentsData);
  const [uploadModalVisible,   setUploadModalVisible]   = useState(false);
  const [previewModalVisible,  setPreviewModalVisible]  = useState(false);
  const [selectedDoc,          setSelectedDoc]          = useState(null);
  const [uploadingDocId,       setUploadingDocId]       = useState(null);
  const [previewImage,         setPreviewImage]         = useState(null);
  // local form state inside the modal
  const [localFieldValues,     setLocalFieldValues]     = useState({});
  const [localImage,           setLocalImage]           = useState(null);

  // ── Open modal ────────────────────────────────────────────────────────────
  const openUploadModal = useCallback(doc => {
    setSelectedDoc(doc);
    setLocalFieldValues({ ...doc.fieldValues });
    setLocalImage(doc.uploadedImage);
    setUploadModalVisible(true);
  }, []);

  // ── Simulate upload ───────────────────────────────────────────────────────
  const simulateUpload = useCallback((docId, imageUri, fieldValues) => {
    setUploadModalVisible(false);
    setUploadingDocId(docId);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setDocuments(prev =>
        prev.map(doc => doc.id === docId ? { ...doc, uploadProgress: progress } : doc),
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
                    fieldValues,
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

  // ── Submit handler (validates, then uploads) ──────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!selectedDoc) return;

    const fields = DOCUMENT_FIELDS[selectedDoc.icon] || [];
    const missingField = fields.find(f => !localFieldValues[f.key]?.trim?.());
    if (missingField) {
      Alert.alert('Missing Field', `Please fill in ${missingField.label}.`);
      return;
    }

    // For non-bank documents, image is required
    const needsImage = selectedDoc.icon !== 'bank';
    if (needsImage && !localImage) {
      Alert.alert('Image Required', 'Please upload or capture a photo of this document.');
      return;
    }

    simulateUpload(selectedDoc.id, localImage, { ...localFieldValues });
  }, [selectedDoc, localFieldValues, localImage, simulateUpload]);

  // ── Take Photo ────────────────────────────────────────────────────────────
  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }
    launchCamera(PICKER_OPTIONS, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setLocalImage(uri);
    });
  }, []);

  // ── Choose from Gallery ───────────────────────────────────────────────────
  const handleChooseFromGallery = useCallback(() => {
    launchImageLibrary(PICKER_OPTIONS, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setLocalImage(uri);
    });
  }, []);

  // ── Card press ────────────────────────────────────────────────────────────
  const handleDocPress = useCallback(doc => {
    setSelectedDoc(doc);
    if (doc.status === 'not_uploaded' || doc.status === 'rejected') {
      openUploadModal(doc);
    } else if (doc.uploadedImage) {
      setPreviewImage(doc.uploadedImage);
      setPreviewModalVisible(true);
    } else {
      const { label } = getStatus(doc.status);
      Alert.alert(
        doc.title,
        [`Status: ${label}`, doc.submittedAt ? `Submitted: ${doc.submittedAt}` : ''].filter(Boolean).join('\n'),
        [
          { text: 'OK' },
          ...(doc.status === 'verified' ? [{ text: 'Update', onPress: () => openUploadModal(doc) }] : []),
        ],
      );
    }
  }, [getStatus, openUploadModal]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const completedCount      = documents.filter(d => d.status === 'verified').length;
  const requiredCount       = documents.filter(d => d.required).length;
  const completionPercentage = requiredCount > 0 ? Math.round((completedCount / requiredCount) * 100) : 0;

  // ── Render document card ──────────────────────────────────────────────────
  const renderDocumentCard = doc => {
    const statusConfig = getStatus(doc.status);
    const StatusIcon   = statusConfig.icon;
    const isUploading  = uploadingDocId === doc.id;

    return (
      <TouchableOpacity
        key={doc.id}
        style={[styles.documentCard, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}
        activeOpacity={0.7}
        onPress={() => handleDocPress(doc)}>

        {/* Left icon / thumbnail */}
        <View style={[styles.iconContainer, { backgroundColor: statusConfig.bgColor }]}>
          {doc.uploadedImage
            ? <Image source={{ uri: doc.uploadedImage }} style={styles.thumbnailImage} />
            : <FileText size={24} color={statusConfig.color} />}
        </View>

        {/* Info */}
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: colors.textPrimary }]}>{doc.title}</Text>
          <Text style={[styles.documentDescription, { color: colors.textSecondary }]}>{doc.description}</Text>

          {/* Show first saved field value as a hint */}
          {Object.keys(doc.fieldValues).length > 0 && (
            <Text
              style={[styles.fieldHint, { color: colors.textSecondary }]}
              numberOfLines={1}>
              {Object.values(doc.fieldValues)[0]}
            </Text>
          )}

          <View style={styles.statusRow}>
            <StatusIcon size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {isUploading ? 'Uploading...' : statusConfig.label}
            </Text>
            {doc.required && (
              <View style={[styles.requiredBadge, { backgroundColor: colors.secondary }]}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            )}
          </View>

          {isUploading && (
            <View style={[styles.progressBarContainer, { backgroundColor: colors.divider }]}>
              <View style={[styles.progressBar, { width: `${doc.uploadProgress}%`, backgroundColor: colors.secondary }]} />
            </View>
          )}

          {doc.rejectionReason && doc.status === 'rejected' && (
            <Text style={[styles.rejectionNote, { color: colors.textSecondary }]}>{doc.rejectionReason}</Text>
          )}
        </View>

        {/* Right action */}
        <View style={styles.actionContainer}>
          {doc.status === 'not_uploaded' || doc.status === 'rejected'
            ? <View style={[styles.uploadBadge, { backgroundColor: colors.secondary }]}><Plus size={16} color={colors.white} /></View>
            : <ChevronRight size={20} color={colors.textSecondary} />}
        </View>
      </TouchableOpacity>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  const modalFields = selectedDoc ? (DOCUMENT_FIELDS[selectedDoc.icon] || []) : [];
  const needsImage  = selectedDoc && selectedDoc.icon !== 'bank';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Documents" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Progress header ── */}
        <View style={[styles.progressHeader, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.progressTextRow}>
            <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Document Verification</Text>
            <Text style={[styles.progressPercent, { color: colors.secondary }]}>{completionPercentage}%</Text>
          </View>
          <View style={[styles.mainProgressContainer, { backgroundColor: colors.divider }]}>
            <View style={[styles.mainProgressBar, { width: `${completionPercentage}%`, backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
            {completedCount} of {requiredCount} required documents verified
          </Text>
          {completionPercentage < 100 && (
            <View style={[styles.warningBanner, { backgroundColor: colors.secondary + '15' }]}>
              <AlertCircle size={16} color={colors.secondary} />
              <Text style={[styles.warningText, { color: colors.secondary }]}>
                Complete all required documents to start driving
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Required Documents</Text>
        {documents.filter(d => d.required).map(renderDocumentCard)}

      
      </ScrollView>

      {/* ══ Upload / Fill Form Modal ══════════════════════════════════════════ */}
      <Modal
        animationType="slide"
        transparent
        visible={uploadModalVisible}
        onRequestClose={() => setUploadModalVisible(false)}>
        <KeyboardAvoidingView
          style={{ flex: 1 , }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>

              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  {selectedDoc?.title}
                </Text>
                <TouchableOpacity onPress={() => setUploadModalVisible(false)} style={styles.closeButton}>
                  <X size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                {selectedDoc?.description}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '75%' }}>

                {/* ── Text Fields ── */}
                {modalFields.length > 0 && (
                  <View style={[styles.fieldsSection, { backgroundColor: colors.inputBg, borderColor: colors.divider }]}>
                    <Text style={[styles.fieldsSectionTitle, { color: colors.textPrimary }]}>Document Details</Text>
                    {modalFields.map((field, idx) => (
                      <View key={field.key} style={[styles.inputWrapper, idx < modalFields.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{field.label}</Text>
                        <TextInput
                          style={[styles.textInput, { color: colors.textPrimary }]}
                          placeholder={field.placeholder}
                          placeholderTextColor={colors.textSecondary + '80'}
                          keyboardType={field.keyboardType}
                          value={localFieldValues[field.key] || ''}
                          onChangeText={val =>
                            setLocalFieldValues(prev => ({ ...prev, [field.key]: val }))
                          }
                          autoCapitalize="characters"
                        />
                      </View>
                    ))}
                  </View>
                )}

                {/* ── Image upload (not for bank) ── */}
                {needsImage && (
                  <View style={styles.imageSection}>
                    <Text style={[styles.fieldsSectionTitle, { color: colors.textPrimary }]}>
                      Document Photo
                    </Text>

                    {/* Preview selected image */}
                    {localImage && (
                      <View style={styles.imagePreviewWrapper}>
                        <Image source={{ uri: localImage }} style={styles.localPreviewImage} resizeMode="cover" />
                        <TouchableOpacity
                          style={[styles.removeImageBtn, { backgroundColor: colors.cardBackground }]}
                          onPress={() => setLocalImage(null)}>
                          <X size={14} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Camera / Gallery buttons */}
                    <View style={styles.imageBtnRow}>
                      <TouchableOpacity
                        style={[styles.imageBtn, { backgroundColor: colors.inputBg, borderColor: colors.divider }]}
                        onPress={handleTakePhoto}>
                        <Camera size={20} color={colors.secondary} />
                        <Text style={[styles.imageBtnText, { color: colors.textPrimary }]}>Take Photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.imageBtn, { backgroundColor: colors.inputBg, borderColor: colors.divider }]}
                        onPress={handleChooseFromGallery}>
                        <ImageIcon size={20} color={colors.secondary} />
                        <Text style={[styles.imageBtnText, { color: colors.textPrimary }]}>Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ── Guidelines ── */}
                {needsImage && (
                  <View style={[styles.guidelinesCard, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.guidelinesTitle, { color: colors.textPrimary }]}>Photo Guidelines:</Text>
                    {[
                      'Ensure all text is clearly visible',
                      'All 4 corners of the document in frame',
                      'No glare or shadows on document',
                      'Document must be current and valid',
                    ].map((tip, i) => (
                      <View key={i} style={styles.guidelineItem}>
                        <View style={[styles.bullet, { backgroundColor: colors.secondary }]} />
                        <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}

              </ScrollView>

              {/* Submit button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.secondary }]}
                onPress={handleSubmit}
                activeOpacity={0.85}>
                <FileUp size={18} color={colors.white} />
                <Text style={[styles.submitButtonText, { color: colors.white }]}>Submit for Verification</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ Image Preview Modal ═══════════════════════════════════════════════ */}
      <Modal
        animationType="fade"
        transparent
        visible={previewModalVisible}
        onRequestClose={() => setPreviewModalVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewModalVisible(false)}>
            <X size={28} color={colors.white} />
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="contain" />
          )}
          <TouchableOpacity
            style={[styles.reUploadButton, { backgroundColor: colors.secondary }]}
            onPress={() => {
              setPreviewModalVisible(false);
              if (selectedDoc) openUploadModal(selectedDoc);
            }}>
            <FileUp size={18} color={colors.white} />
            <Text style={[styles.reUploadText, { color: colors.white }]}>Re-upload</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1 },
  scrollContent: { paddingBottom: scale(32) },

  // Progress Header
  progressHeader: {
    margin: scale(16), padding: scale(16), borderRadius: scale(12),
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  progressTextRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(12) },
  progressTitle:        { fontSize: moderateScale(16), fontFamily: fonts.semiBold },
  progressPercent:      { fontSize: moderateScale(20), fontFamily: fonts.bold },
  mainProgressContainer:{ height: scale(8), borderRadius: scale(4), overflow: 'hidden', marginBottom: scale(8) },
  mainProgressBar:      { height: '100%', borderRadius: scale(4) },
  progressSubtitle:     { fontSize: moderateScale(13), marginBottom: scale(12) },
  warningBanner:        { flexDirection: 'row', alignItems: 'center', padding: scale(12), borderRadius: scale(8), gap: scale(8) },
  warningText:          { fontSize: moderateScale(12), fontFamily: fonts.medium, flex: 1 },

  // Section
  sectionTitle: {
    fontSize: moderateScale(14), fontFamily: fonts.semiBold,
    marginHorizontal: scale(16), marginTop: scale(16), marginBottom: scale(8),
  },

  // Document Card
  documentCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: scale(16), marginVertical: scale(6),
    padding: scale(12), borderRadius: scale(12), borderWidth: 1,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2,
  },
  iconContainer: {
    width: scale(48), height: scale(48), borderRadius: scale(10),
    alignItems: 'center', justifyContent: 'center', marginRight: scale(12), overflow: 'hidden',
  },
  thumbnailImage:       { width: scale(48), height: scale(48), borderRadius: scale(10) },
  documentInfo:         { flex: 1 },
  documentTitle:        { fontSize: moderateScale(15), fontFamily: fonts.semiBold, marginBottom: scale(2) },
  documentDescription:  { fontSize: moderateScale(12), marginBottom: scale(4) },
  fieldHint:            { fontSize: moderateScale(11), fontFamily: fonts.medium, marginBottom: scale(4) },
  statusRow:            { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  statusText:           { fontSize: moderateScale(12), fontFamily: fonts.medium },
  requiredBadge:        { paddingHorizontal: scale(6), paddingVertical: scale(2), borderRadius: scale(4), marginLeft: scale(4) },
  requiredText:         { fontSize: moderateScale(10), fontFamily: fonts.bold, color: '#FFF' },
  progressBarContainer: { height: scale(4), borderRadius: scale(2), overflow: 'hidden', marginTop: scale(8) },
  progressBar:          { height: '100%', borderRadius: scale(2) },
  rejectionNote:        { fontSize: moderateScale(11), fontFamily: fonts.medium, marginTop: scale(4) },
  actionContainer:      { marginLeft: scale(8) },
  uploadBadge:          { width: scale(28), height: scale(28), borderRadius: scale(14), alignItems: 'center', justifyContent: 'center' },

  // Upload Modal
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' , },
  modalContainer: { borderTopLeftRadius: scale(20), borderTopRightRadius: scale(20), padding: scale(20), paddingBottom: scale(10) },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(8) },
  modalTitle:     { fontSize: moderateScale(18), fontFamily: fonts.bold },
  closeButton:    { padding: scale(4) },
  modalSubtitle:  { fontSize: moderateScale(14), marginBottom: scale(16) },

  // Fields section
  fieldsSection: {
    borderRadius: scale(12), borderWidth: 1, overflow: 'hidden', marginBottom: scale(16),
  },
  fieldsSectionTitle: {
    fontSize: moderateScale(13), fontFamily: fonts.semiBold,
    paddingHorizontal: scale(14), paddingTop: scale(12), paddingBottom: scale(8),
  },
  inputWrapper: { paddingHorizontal: scale(14), paddingVertical: scale(10) },
  inputLabel:   { fontSize: moderateScale(11), fontFamily: fonts.medium, marginBottom: scale(4) },
  textInput:    { fontSize: moderateScale(14), fontFamily: fonts.regular, paddingVertical: scale(2) },

  // Image section
  imageSection: { marginBottom: scale(16) },
  imagePreviewWrapper: {
    position: 'relative', width: '100%', height: scale(160),
    borderRadius: scale(12), overflow: 'hidden', marginBottom: scale(10),
  },
  localPreviewImage: { width: '100%', height: '100%' },
  removeImageBtn: {
    position: 'absolute', top: scale(8), right: scale(8),
    width: scale(26), height: scale(26), borderRadius: scale(13),
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
  },
  imageBtnRow: { flexDirection: 'row', gap: scale(12) },
  imageBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(8), paddingVertical: scale(14), borderRadius: scale(12), borderWidth: 1,
  },
  imageBtnText: { fontSize: moderateScale(13), fontFamily: fonts.semiBold },

  // Guidelines
  guidelinesCard:  { padding: scale(16), borderRadius: scale(12), marginBottom: scale(12) },
  guidelinesTitle: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, marginBottom: scale(12) },
  guidelineItem:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: scale(8) },
  bullet:          { width: scale(6), height: scale(6), borderRadius: scale(3), marginTop: scale(5), marginRight: scale(8) },
  guidelineText:   { fontSize: moderateScale(12), flex: 1, lineHeight: moderateScale(18) },

  // Submit button
  submitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(8), paddingVertical: scale(16), borderRadius: scale(14), marginTop: scale(8),
  },
  submitButtonText: { fontSize: moderateScale(15), fontFamily: fonts.semiBold },

  // Preview Modal
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center',  },
  previewClose:   { position: 'absolute', top: scale(50), right: scale(20), zIndex: 10, padding: scale(8) },
  previewImage:   { width: '90%', height: '65%', borderRadius: scale(12) },
  reUploadButton: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    marginTop: scale(24), paddingHorizontal: scale(24), paddingVertical: scale(12), borderRadius: scale(30),
  },
  reUploadText: { color: '#FFF', fontSize: moderateScale(15), fontFamily: fonts.semiBold },
});

export default DocumentsScreen;