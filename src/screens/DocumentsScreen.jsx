import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FileText, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const documentsData = [
  {
    id: 1,
    title: 'Driving License',
    subtitle: 'Verified',
    status: 'verified',
  },
  {
    id: 2,
    title: 'Vehicle Registration',
    subtitle: 'Verified',
    status: 'verified',
  },
  {
    id: 3,
    title: 'Insurance Certificate',
    subtitle: 'Verified',
    status: 'verified',
  },
  {
    id: 4,
    title: 'Background Check',
    subtitle: 'Verified',
    status: 'verified',
  },
  {
    id: 5,
    title: 'Profile Photo',
    subtitle: 'Verified',
    status: 'verified',
  },
  {
    id: 6,
    title: 'Bank Account Details',
    subtitle: 'Verified',
    status: 'verified',
  },
];

const DocumentsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Documents" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {documentsData.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.documentItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <FileText size={24} color={colors.darkText} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{doc.title}</Text>
              <View style={styles.statusRow}>
                <CheckCircle2 size={14} color={colors.green} />
                <Text style={styles.documentStatus}>{doc.subtitle}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>
        ))}

        {/* Upload New Document Button */}
        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7}>
          <Text style={styles.uploadButtonText}>+ Upload New Document</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
    backgroundColor: colors.veryLightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: colors.darkText,
    marginBottom: scale(4),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  documentStatus: {
    fontSize: moderateScale(13),
    color: colors.green,
  },
  uploadButton: {
    marginHorizontal: scale(16),
    marginTop: scale(24),
    paddingVertical: scale(16),
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: scale(8),
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
  },
});

export default DocumentsScreen;
