'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AlumniIDCardPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [alumni, setAlumni] = useState<(AlumniData & { id: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const alumniRef = ref(database, `alumni/${id}`);
        const unsubscribe = onValue(alumniRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setAlumni({ ...data, id });
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
    );

    if (!alumni) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
            <h1 className="text-lg font-semibold text-gray-700">Profile Not Found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    );

    const alumniCode = `YIA-${alumni.yearOfGraduation}-${alumni.id?.slice(-6).toUpperCase()}`;

    // Encode a string into Code 128-style barcode bars (deterministic from char codes)
    const BarcodeFromId = ({ value }: { value: string }) => {
        const bars: { width: number; isBar: boolean }[] = [];

        // Start pattern
        bars.push({ width: 2, isBar: true }, { width: 1, isBar: false }, { width: 1, isBar: true }, { width: 1, isBar: false });

        // Encode each character as a series of bars/spaces derived from char code
        for (let i = 0; i < value.length; i++) {
            const code = value.charCodeAt(i);
            const pattern = [
                ((code >> 5) & 3) + 1,
                ((code >> 3) & 3) + 1,
                ((code >> 1) & 3) + 1,
                (code & 1) + 1,
            ];
            pattern.forEach((w, pi) => {
                bars.push({ width: w, isBar: pi % 2 === 0 });
            });
        }

        // Stop pattern
        bars.push({ width: 2, isBar: true }, { width: 1, isBar: false }, { width: 2, isBar: true }, { width: 1, isBar: false });

        const totalUnits = bars.reduce((s, b) => s + b.width, 0);
        const svgWidth = 120;
        const svgHeight = 28;
        const unitPx = svgWidth / totalUnits;

        let x = 0;
        const rects: React.ReactNode[] = [];
        bars.forEach((bar, i) => {
            const w = bar.width * unitPx;
            if (bar.isBar) {
                rects.push(
                    <rect key={i} x={x} y={0} width={w} height={svgHeight} fill="#0f172a" />
                );
            }
            x += w;
        });

        return (
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ display: 'block' }}>
                {rects}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white flex flex-col items-center"
            style={{ padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>

            {/* Control Bar */}
            <div className="no-print mb-10 flex justify-between items-center" style={{ width: '220px' }}>
                <Button variant="ghost" onClick={() => router.back()}
                    className="gap-2 font-semibold text-gray-500 hover:text-gray-900 rounded-xl text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => window.print()}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl gap-2 font-semibold px-5 text-sm">
                    <Printer className="h-3.5 w-3.5" /> Print
                </Button>
            </div>

            {/* ══ FRONT FACE ══ */}
            <div className="id-card relative bg-white overflow-hidden"
                style={{
                    width: '54mm',
                    height: '86mm',
                    borderRadius: '3mm',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                }}>

                {/* ── Header band ── */}
                <div style={{
                    background: '#0f172a',
                    padding: '3.5mm 4mm 3mm',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5mm',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Subtle line pattern */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 6px)',
                    }} />

                    {/* Logo — white version on dark bg */}
                    <div style={{
                        position: 'relative', zIndex: 1,
                        width: '100%', display: 'flex',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <img
                            src="/logo.png"
                            alt="YES INDIA"
                            style={{
                                height: '8mm',
                                width: 'auto',
                                filter: 'brightness(0) invert(1)',
                                display: 'block',
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    <p style={{
                        fontSize: '4.5px', color: '#94a3b8',
                        letterSpacing: '0.35em', fontWeight: 800,
                        textTransform: 'uppercase', lineHeight: 1,
                        position: 'relative', zIndex: 1,
                    }}>
                        Alumni Identity Card
                    </p>
                </div>

                {/* ── Photo + Name block ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '3mm',
                    padding: '3.5mm 4mm 2.5mm',
                    borderBottom: '0.5px solid #e2e8f0',
                }}>
                    {/* Photo */}
                    <div style={{
                        width: '18mm',
                        height: '22mm',
                        flexShrink: 0,
                        border: '1px solid #cbd5e1',
                        overflow: 'hidden',
                        background: '#f8fafc',
                    }}>
                        <Avatar style={{ width: '100%', height: '100%', borderRadius: 0 }}>
                            <AvatarImage src={alumni.photoURL} className="object-cover"
                                style={{ objectPosition: 'center 15%', borderRadius: 0 }} />
                            <AvatarFallback style={{
                                borderRadius: 0, background: '#f1f5f9',
                                color: '#94a3b8', fontSize: '16px', fontWeight: 900,
                            }}>
                                {alumni.fullName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Name + batch only */}
                    <div style={{ flex: 1, paddingTop: '1mm' }}>
                        <p style={{
                            fontSize: '9px', fontWeight: 900, color: '#0f172a',
                            textTransform: 'uppercase', letterSpacing: '0.02em',
                            lineHeight: 1.2, marginBottom: '2.5mm',
                            wordBreak: 'break-word',
                        }}>
                            {alumni.fullName}
                        </p>
                        <div style={{
                            display: 'inline-block',
                            background: '#0f172a',
                            color: '#fff',
                            fontSize: '5px',
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            padding: '1mm 2mm',
                        }}>
                            Batch {alumni.yearOfGraduation}
                        </div>
                    </div>
                </div>

                {/* ── Detail rows ── */}
                <div style={{ padding: '2.5mm 4mm', display: 'flex', flexDirection: 'column', gap: '2mm', flex: 1 }}>
                    {[
                        { label: 'School', value: alumni.schoolAttended },
                        { label: 'Residential Address', value: alumni.address },
                        { label: 'District', value: alumni.district },
                        { label: 'State', value: alumni.state },
                        { label: 'Mobile', value: alumni.mobileNumber },
                    ].map(({ label, value }) => value ? (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.3mm' }}>
                            <span style={{ fontSize: '4px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                                {label}
                            </span>
                            <span style={{ fontSize: '6px', color: '#1e293b', fontWeight: 600, lineHeight: 1.3 }}>
                                {value}
                            </span>
                        </div>
                    ) : null)}

                    {/* Alumni ID */}
                    <div style={{ marginTop: '1mm', paddingTop: '2mm', borderTop: '0.5px dashed #e2e8f0' }}>
                        <span style={{ fontSize: '4px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '0.5mm' }}>
                            Alumni ID
                        </span>
                        <span style={{ fontSize: '7px', color: '#0f172a', fontWeight: 900, letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                            {alumniCode}
                        </span>
                    </div>
                </div>

                {/* ── Footer strip ── */}
                <div style={{ height: '3mm', background: '#0f172a', width: '100%', marginTop: 'auto' }} />
            </div>

            {/* Divider label */}
            <div className="no-print" style={{ margin: '10mm 0 6mm', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ height: '1px', width: '40px', background: '#cbd5e1' }} />
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Back</span>
                <div style={{ height: '1px', width: '40px', background: '#cbd5e1' }} />
            </div>

            {/* ══ BACK FACE ══ */}
            <div className="id-card relative bg-white overflow-hidden"
                style={{
                    width: '54mm',
                    height: '86mm',
                    borderRadius: '3mm',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                }}>

                {/* Top strip */}
                <div style={{ height: '5mm', background: '#0f172a', width: '100%' }} />

                {/* Body */}
                <div style={{ flex: 1, padding: '4mm', display: 'flex', flexDirection: 'column', gap: '2.5mm' }}>

                    {/* Greyed logo watermark */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5mm' }}>
                        <img src="/logo.png" alt="YES INDIA"
                            style={{ height: '6mm', width: 'auto', opacity: 0.15, filter: 'grayscale(1)' }} />
                    </div>

                    {/* Terms */}
                    <p style={{
                        fontSize: '4.5px', color: '#64748b', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.3em',
                        textAlign: 'center', marginBottom: '1mm',
                    }}>
                        Terms of Use
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm', flex: 1 }}>
                        {[
                            'This card is the official identity credential for YES India Alumni.',
                            'This card is strictly non-transferable and remains the property of YES India Foundation.',
                            'Report loss or damage immediately to your nearest YES India office.',
                            'Misuse may result in cancellation of alumni membership.',
                        ].map((text, i) => (
                            <div key={i} style={{ display: 'flex', gap: '2mm', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '5px', fontWeight: 900, color: '#0f172a', lineHeight: 1.4, flexShrink: 0, fontFamily: 'monospace' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span style={{ fontSize: '5px', color: '#64748b', lineHeight: 1.6 }}>{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Signature line */}
                    <div style={{ borderTop: '0.5px dashed #e2e8f0', paddingTop: '2.5mm', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1mm' }}>
                        <div style={{ height: '5mm', width: '24mm', borderBottom: '0.5px solid #cbd5e1' }} />
                        <p style={{ fontSize: '4px', color: '#94a3b8', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase' }}>
                            Authorised Signatory
                        </p>
                    </div>

                    {/* ── Barcode encoded from alumni ID ── */}
                    <div style={{
                        borderTop: '0.5px solid #e2e8f0',
                        paddingTop: '2.5mm',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1mm',
                    }}>
                        <BarcodeFromId value={alumniCode} />
                        <p style={{
                            fontSize: '4px', color: '#94a3b8',
                            letterSpacing: '0.15em', fontWeight: 700,
                            fontFamily: 'monospace', textTransform: 'uppercase',
                        }}>
                            {alumniCode}
                        </p>
                    </div>
                </div>

                {/* Bottom strip */}
                <div style={{
                    background: '#0f172a',
                    padding: '2mm 4mm',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <p style={{ fontSize: '4px', color: '#475569', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase' }}>
                        Connect · Inspire · Empower
                    </p>
                    <p style={{ fontSize: '4px', color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>
                        {alumni.yearOfGraduation}
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { size: A4; margin: 15mm; }
                    html, body {
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print { display: none !important; }
                    .id-card {
                        box-shadow: none !important;
                        margin: 0 auto 15mm auto !important;
                        break-inside: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
}