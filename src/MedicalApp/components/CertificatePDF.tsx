import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CertificateData } from '../store/useMedicalStore';

interface CertificatePDFProps {
    certificate: CertificateData;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#fffbf5',
        fontFamily: 'Helvetica',
    },
    certificateContainer: {
        flex: 1,
        padding: 30,
        border: '3px solid #8b7355',
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    certificateNumber: {
        position: 'absolute',
        top: 30,
        right: 30,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    decorativeLine: {
        height: 1,
        backgroundColor: '#999',
        marginVertical: 15,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 15,
    },
    logoBox: {
        width: 60,
        height: 70,
        border: '2px solid #333',
        backgroundColor: '#333',
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
        letterSpacing: 3,
    },
    subtitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    subtitleLine: {
        flex: 0,
        height: 1,
        width: 30,
        backgroundColor: '#999',
    },
    subtitleText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#666',
        letterSpacing: 2,
    },
    nameSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    nameLineTop: {
        height: 1,
        backgroundColor: '#666',
        width: '80%',
        marginBottom: 8,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 8,
    },
    nameLineBottom: {
        height: 1,
        backgroundColor: '#666',
        width: '80%',
    },
    description: {
        fontSize: 10,
        textAlign: 'center',
        color: '#333',
        marginVertical: 15,
        lineHeight: 1.6,
        fontWeight: 'bold',
    },
    decorativeSymbol: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        marginVertical: 10,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    statBox: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        width: '28%',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff6b00',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#666',
        letterSpacing: 1,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 2,
        borderTopColor: '#666',
    },
    qrSection: {
        alignItems: 'center',
    },
    qrBox: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#666',
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    qrText: {
        fontSize: 6,
        color: '#999',
    },
    dateText: {
        fontSize: 8,
        color: '#666',
        fontWeight: 'bold',
    },
    signatureSection: {
        alignItems: 'center',
        flex: 1,
    },
    signatureLine: {
        fontSize: 24,
        color: '#000',
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'Courier',
    },
    signatureName: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    signatureTitle: {
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
});

export const CertificatePDF: React.FC<CertificatePDFProps> = ({ certificate }) => {
    const wrongAnswers = certificate.total_questions - certificate.correct_answers;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.certificateContainer}>
                    {/* Certificate Number */}
                    <Text style={styles.certificateNumber}>
                        No. {String(certificate.certificate_number).padStart(3, '0')}
                    </Text>

                    {/* Top Decorative Line */}
                    <View style={styles.decorativeLine} />

                    {/* OXU Logo */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoText}>OXU</Text>
                        </View>
                    </View>

                    {/* Main Title */}
                    <Text style={styles.title}>SERTIFIKAT</Text>

                    {/* Subtitle */}
                    <View style={styles.subtitle}>
                        <View style={styles.subtitleLine} />
                        <Text style={styles.subtitleText}>O-X-U</Text>
                        <View style={styles.subtitleLine} />
                    </View>

                    {/* Student Name Section */}
                    <View style={styles.nameSection}>
                        <View style={styles.nameLineTop} />
                        <Text style={styles.studentName}>{certificate.full_name}</Text>
                        <View style={styles.nameLineBottom} />
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        LOTIN TILI VA TIBBIY TERMINOLOGIYA NOMLI LUGATDAGI{'\n'}
                        MUVAFFAQIYATLI O'ZLASHTIRGANLIGI UCHUN{'\n'}
                        MAZKUR SERTIFIKAT BILAN TAQDIRLANADI
                    </Text>

                    {/* Decorative Symbol */}
                    <Text style={styles.decorativeSymbol}>◆ ◇ ◆</Text>

                    {/* Statistics */}
                    <View style={styles.statsSection}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{certificate.percentage}%</Text>
                            <Text style={styles.statLabel}>FOIZ</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{certificate.correct_answers}</Text>
                            <Text style={styles.statLabel}>TO'G'RI</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{wrongAnswers}</Text>
                            <Text style={styles.statLabel}>XATO</Text>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomSection}>
                        <View style={styles.qrSection}>
                            <View style={styles.qrBox}>
                                <Text style={styles.qrText}>QR</Text>
                            </View>
                            <Text style={styles.dateText}>
                                {new Date(certificate.issued_date).toLocaleDateString('uz-UZ')}
                            </Text>
                        </View>

                        <View style={styles.signatureSection}>
                            <Text style={styles.signatureLine}>________</Text>
                            <Text style={styles.signatureName}>Maxmurova Mavjuda Halimovna</Text>
                            <Text style={styles.signatureTitle}>Direktori</Text>
                        </View>
                    </View>

                    {/* Bottom Decorative Line */}
                    <View style={[styles.decorativeLine, { marginTop: 20 }]} />
                </View>
            </Page>
        </Document>
    );
};
