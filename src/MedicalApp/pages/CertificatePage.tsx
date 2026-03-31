import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Home } from 'lucide-react';
import { NeonButton } from '../components/UIElements';
import { useMedicalStore } from '../store/useMedicalStore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/CertificatePDF';
import QRCode from 'qrcode';

interface CertificatePageProps {
    onHome: () => void;
}

export const CertificatePage: React.FC<CertificatePageProps> = ({ onHome }) => {
    const { certificate } = useMedicalStore();
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (certificate && qrCanvasRef.current) {
            // Generate QR code
            const qrData = `https://certificate.oxu.uz/verify/${certificate.certificate_number}`;
            QRCode.toCanvas(qrCanvasRef.current, qrData, { width: 200, margin: 1 }, (error) => {
                if (error) console.error('QR Code error:', error);
                else if (qrCanvasRef.current) {
                    setQrDataUrl(qrCanvasRef.current.toDataURL());
                }
            });
        }
    }, [certificate]);

    if (!certificate) {
        return (
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-black uppercase italic text-red-500 mb-4">Sertifikat topilmadi</h2>
                    <p className="text-[var(--text-muted)] mb-8">Barcha mavzularning testlarini yechib sertifikatni qo'l qo'yingiz.</p>
                </motion.div>
                <NeonButton onClick={onHome} className="w-full text-xs py-2.5">BOSQICHLAR</NeonButton>
            </div>
        );
    }

    const wrongAnswers = certificate.total_questions - certificate.correct_answers;
    const svgWidth = 1050;
    const svgHeight = 1485;

    return (
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-[#ff6b00] mb-2">
                    🎉 TEBRIKLAYMIZ! 🎉
                </h1>
                <p className="text-[var(--text-muted)] text-base">
                    Siz barcha mavzularning testlarini muvaffaqiyatli yechib sertifikatni oldinggingiz!
                </p>
            </motion.div>

            {/* Hidden QR Canvas for generation */}
            <canvas ref={qrCanvasRef} style={{ display: 'none' }} />

            {/* SVG Certificate - Professional Design */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl mx-auto mb-8 bg-white rounded-lg shadow-2xl overflow-hidden"
            >
                <svg
                    ref={svgRef}
                    width="100%"
                    height="auto"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ maxWidth: '100%', height: 'auto' }}
                >
                    {/* Background - Cream color */}
                    <defs>
                        <pattern id="watermark" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                            <text x="200" y="200" fontSize="80" fontWeight="bold" fill="#f5f5f5" textAnchor="middle" opacity="0.1">OXU</text>
                        </pattern>
                    </defs>

                    <rect width={svgWidth} height={svgHeight} fill="#faf8f3" />
                    <rect width={svgWidth} height={svgHeight} fill="url(#watermark)" />

                    {/* Outer decorative border */}
                    <rect x="30" y="30" width={svgWidth - 60} height={svgHeight - 60} fill="none" stroke="#8b7355" strokeWidth="12" />
                    <rect x="40" y="40" width={svgWidth - 80} height={svgHeight - 80} fill="none" stroke="#c9a876" strokeWidth="2" />

                    {/* Decorative corners */}
                    {/* Top Left Corner */}
                    <g transform="translate(70, 85)">
                        <path d="M 0 15 L 0 0 L 15 0" fill="none" stroke="#9b8b7e" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 2 13 L 2 2 L 13 2" fill="none" stroke="#9b8b7e" strokeWidth="1" opacity="0.6" />
                    </g>
                    
                    {/* Top Right Corner */}
                    <g transform={`translate(${svgWidth - 70}, 85) scale(-1, 1)`}>
                        <path d="M 0 15 L 0 0 L 15 0" fill="none" stroke="#9b8b7e" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 2 13 L 2 2 L 13 2" fill="none" stroke="#9b8b7e" strokeWidth="1" opacity="0.6" />
                    </g>
                    
                    {/* Bottom Left Corner */}
                    <g transform={`translate(70, ${svgHeight - 85}) scale(1, -1)`}>
                        <path d="M 0 15 L 0 0 L 15 0" fill="none" stroke="#9b8b7e" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 2 13 L 2 2 L 13 2" fill="none" stroke="#9b8b7e" strokeWidth="1" opacity="0.6" />
                    </g>
                    
                    {/* Bottom Right Corner */}
                    <g transform={`translate(${svgWidth - 70}, ${svgHeight - 85}) scale(-1, -1)`}>
                        <path d="M 0 15 L 0 0 L 15 0" fill="none" stroke="#9b8b7e" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 2 13 L 2 2 L 13 2" fill="none" stroke="#9b8b7e" strokeWidth="1" opacity="0.6" />
                    </g>

                    {/* Certificate Number - Top Right - Professional Format */}
                    <text x={svgWidth - 120} y="115" fontSize="14" fontWeight="bold" fill="#555" textAnchor="end" fontFamily="Arial, sans-serif" letterSpacing="1">
                        No. CERT-{new Date(certificate.issued_date).getFullYear()}{String(certificate.certificate_number).padStart(4, '0')}-{String(Math.floor(Math.random() * 9999)).padStart(5, '0')}
                    </text>

                    {/* Top Decorative Line */}
                    <line x1="150" y1="150" x2={svgWidth - 150} y2="150" stroke="#999" strokeWidth="1" />
                    <circle cx={svgWidth / 2} cy="150" r="6" fill="#666" />

                    {/* OXU Shield Logo - Real Professional Logo */}
                    <g transform="translate(525, 150)">
                        {/* Navy Blue Shield Background */}
                        <path d="M 0 -65 L -50 -30 L -50 45 Q 0 80 50 45 L 50 -30 Z" fill="#1e3a5f" stroke="#1a2d47" strokeWidth="2" />
                        
                        {/* Inner light gradient */}
                        <path d="M -45 -28 L -45 42 Q 0 75 45 42 L 45 -28 Q 0 -60 -45 -28" fill="#2c5aa0" opacity="0.3" />
                        
                        {/* White circle for globe */}
                        <circle cx="0" cy="-12" r="16" fill="#f5f5f5" stroke="#ffffff" strokeWidth="1.5" />
                        
                        {/* Globe details - continents/meridians */}
                        <circle cx="0" cy="-12" r="16" fill="none" stroke="#1e3a5f" strokeWidth="1" opacity="0.7" />
                        <line x1="0" y1="-28" x2="0" y2="4" stroke="#1e3a5f" strokeWidth="1.2" opacity="0.6" />
                        <ellipse cx="0" cy="-12" rx="15" ry="5" fill="none" stroke="#1e3a5f" strokeWidth="0.8" opacity="0.5" />
                        <ellipse cx="0" cy="-12" rx="10" ry="14" fill="none" stroke="#1e3a5f" strokeWidth="0.8" opacity="0.5" />
                        
                        {/* Left Laurel Wreath - more detailed */}
                        <g>
                            {/* Main wreath line */}
                            <path d="M -22 -5 Q -28 -15 -30 -8 Q -28 0 -22 5" fill="none" stroke="#ffffff" strokeWidth="2" />
                            {/* Leaves */}
                            <ellipse cx="-24" cy="-12" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-30 -24 -12)" opacity="0.9" />
                            <ellipse cx="-26" cy="-8" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-15 -26 -8)" opacity="0.9" />
                            <ellipse cx="-26" cy="0" rx="2.5" ry="4" fill="#ffffff" transform="rotate(15 -26 0)" opacity="0.9" />
                            <ellipse cx="-24" cy="8" rx="2.5" ry="4" fill="#ffffff" transform="rotate(30 -24 8)" opacity="0.9" />
                        </g>
                        
                        {/* Right Laurel Wreath - mirror */}
                        <g>
                            {/* Main wreath line */}
                            <path d="M 22 -5 Q 28 -15 30 -8 Q 28 0 22 5" fill="none" stroke="#ffffff" strokeWidth="2" />
                            {/* Leaves */}
                            <ellipse cx="24" cy="-12" rx="2.5" ry="4" fill="#ffffff" transform="rotate(30 24 -12)" opacity="0.9" />
                            <ellipse cx="26" cy="-8" rx="2.5" ry="4" fill="#ffffff" transform="rotate(15 26 -8)" opacity="0.9" />
                            <ellipse cx="26" cy="0" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-15 26 0)" opacity="0.9" />
                            <ellipse cx="24" cy="8" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-30 24 8)" opacity="0.9" />
                        </g>
                        
                        {/* OXU Text */}
                        <text x="0" y="30" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" letterSpacing="3">OXU</text>
                        
                        {/* SINCE 2002 Text */}
                        <text x="0" y="45" fontSize="8" fill="#ffffff" textAnchor="middle" fontFamily="Arial, sans-serif" opacity="0.95" letterSpacing="1">SINCE 2002</text>
                    </g>

                    {/* Main Title */}
                    <text x={svgWidth / 2} y="370" fontSize="80" fontWeight="bold" fill="#1a1a1a" textAnchor="middle" letterSpacing="8" fontFamily="Georgia, serif">
                        SERTIFIKAT
                    </text>

                    {/* Decorative line under title */}
                    <line x1="200" y1="410" x2={svgWidth - 200} y2="410" stroke="#666" strokeWidth="2" />

                    {/* Subtitle O-X-U */}
                    <text x={svgWidth / 2} y="445" fontSize="14" fontWeight="bold" fill="#666" textAnchor="middle" letterSpacing="3">
                        O · X · U
                    </text>

                    {/* Student Name Lines */}
                    <line x1="200" y1="490" x2={svgWidth - 200} y2="490" stroke="#333" strokeWidth="1.5" />
                    <text x={svgWidth / 2} y="540" fontSize="32" fontWeight="bold" fill="#1a1a1a" textAnchor="middle" letterSpacing="2">
                        {certificate.full_name}
                    </text>
                    <line x1="200" y1="560" x2={svgWidth - 200} y2="560" stroke="#333" strokeWidth="1.5" />

                    {/* Certificate Description */}
                    <text x={svgWidth / 2} y="620" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle" fontFamily="Arial, sans-serif">
                        LOTIN TILI VA TIBBIY TERMINOLOGIYA NOMLI LUGATDAGI
                    </text>
                    <text x={svgWidth / 2} y="645" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle" fontFamily="Arial, sans-serif">
                        MUVAFFAQIYATLI O'ZLASHTIRGANLIGI UCHUN
                    </text>
                    <text x={svgWidth / 2} y="670" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle" fontFamily="Arial, sans-serif">
                        MAZKUR SERTIFIKAT BILAN TAQDIRLANADI
                    </text>

                    {/* Decorative symbol */}
                    <text x={svgWidth / 2} y="720" fontSize="20" fill="#999" textAnchor="middle" opacity="0.5">
                        ◆ ◇ ◆
                    </text>

                    {/* Statistics Section */}
                    <g>
                        {/* Percentage Box */}
                        <rect x={svgWidth / 2 - 300} y="750" width="180" height="120" fill="none" stroke="#333" strokeWidth="2" rx="4" />
                        <text x={svgWidth / 2 - 210} y="805" fontSize="56" fontWeight="bold" fill="#ff6b00" textAnchor="middle">
                            {Math.round(certificate.percentage)}%
                        </text>
                        <text x={svgWidth / 2 - 210} y="850" fontSize="12" fontWeight="bold" fill="#666" textAnchor="middle" letterSpacing="2">
                            FOIZ
                        </text>

                        {/* Correct Answers Box */}
                        <rect x={svgWidth / 2 - 90} y="750" width="180" height="120" fill="none" stroke="#333" strokeWidth="2" rx="4" />
                        <text x={svgWidth / 2} y="805" fontSize="56" fontWeight="bold" fill="#16a34a" textAnchor="middle">
                            {certificate.correct_answers}
                        </text>
                        <text x={svgWidth / 2} y="850" fontSize="12" fontWeight="bold" fill="#666" textAnchor="middle" letterSpacing="2">
                            TO'G'RI
                        </text>

                        {/* Wrong Answers Box */}
                        <rect x={svgWidth / 2 + 120} y="750" width="180" height="120" fill="none" stroke="#333" strokeWidth="2" rx="4" />
                        <text x={svgWidth / 2 + 210} y="805" fontSize="56" fontWeight="bold" fill="#dc2626" textAnchor="middle">
                            {wrongAnswers}
                        </text>
                        <text x={svgWidth / 2 + 210} y="850" fontSize="12" fontWeight="bold" fill="#666" textAnchor="middle" letterSpacing="2">
                            XATO
                        </text>
                    </g>

                    {/* Bottom Divider Line */}
                    <line x1="100" y1="920" x2={svgWidth - 100} y2="920" stroke="#333" strokeWidth="2" />

                    {/* QR Code Section */}
                    <g>
                        {/* QR Label */}
                        <text x="180" y="1000" fontSize="14" fontWeight="bold" fill="#666">
                            {new Date(certificate.issued_date).toLocaleDateString('uz-UZ')}
                        </text>

                        {/* QR Code Placeholder */}
                        <rect x="130" y="1020" width="100" height="100" fill="white" stroke="#333" strokeWidth="2" />
                        <text x="180" y="1075" fontSize="16" fontWeight="bold" fill="#999" textAnchor="middle">QR</text>

                        {qrDataUrl && (
                            <image href={qrDataUrl} x="130" y="1020" width="100" height="100" />
                        )}
                    </g>

                    {/* Signature Section - Professional Layout */}
                    <g>
                        {/* Signature handwritten-style line */}
                        <path d={`M ${svgWidth / 2 + 80} 1055 Q ${svgWidth / 2 + 120} 1045 ${svgWidth - 120} 1055`} fill="none" stroke="#333" strokeWidth="2.5" />
                        
                        {/* Signature Name */}
                        <text x={svgWidth / 2 + 225} y="1105" fontSize="13" fontWeight="bold" fill="#1a1a1a" textAnchor="middle" fontFamily="Georgia, serif">
                            Maxmurova Mavjuda Halimovna
                        </text>

                        {/* Signature Title */}
                        <text x={svgWidth / 2 + 225} y="1130" fontSize="11" fill="#555" textAnchor="middle" fontFamily="Arial, sans-serif">
                            Direktori
                        </text>
                    </g>

                    {/* Bottom decorative line */}
                    <line x1="150" y1={svgHeight - 150} x2={svgWidth - 150} y2={svgHeight - 150} stroke="#999" strokeWidth="1" />
                    <circle cx={svgWidth / 2} cy={svgHeight - 150} r="6" fill="#666" />
                </svg>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 max-w-2xl mx-auto"
            >
                <PDFDownloadLink
                    document={<CertificatePDF certificate={certificate} />}
                    fileName={`Sertifikat-${certificate.certificate_number}.pdf`}
                    className="w-full"
                >
                    {({ loading }) => (
                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffa500] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                            <Download size={20} />
                            {loading ? 'Tayyorlanyapti...' : 'PDF sifatida yuklab olish'}
                        </button>
                    )}
                </PDFDownloadLink>
                <NeonButton
                    onClick={onHome}
                    className="w-full text-sm py-4 flex items-center justify-center gap-2"
                    variant="secondary"
                >
                    <Home size={18} />
                    BOSQICHLAR
                </NeonButton>
            </motion.div>

            {/* Congratulations Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 p-8 bg-gradient-to-r from-[#ff6b00]/10 to-[#ff8c00]/10 rounded-xl border-2 border-[#ff6b00]/40 max-w-2xl mx-auto"
            >
                <p className="text-center text-[var(--text-muted)] text-base leading-relaxed font-semibold">
                    ✨ Siz jiddiy mehnatingiz va samiylik bilan o'quning natijasida ushbu sertifikatni qo'lga kiritdingiz.<br />
                    <span className="text-[#ff6b00] font-black">Bu sertifikat sizning Tibbiy terminologiya va Lotin tilida bilimingizning rasmiy tasdiqidir!</span> ✨
                </p>
            </motion.div>
        </div>
    );
};

export default CertificatePage;
