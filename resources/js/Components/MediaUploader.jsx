import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function MediaUploader({
    value = '',
    onChange,
    folder = 'general',
    accept = 'image/*,video/*',
    multiple = false,
    label = 'Upload Media (Photos or Videos)',
    helpText = 'Supports JPG, PNG, WEBP, and MP4/WEBM videos up to 50MB.',
    isAdmin = false,
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const uploadUrl = isAdmin ? '/admin/media/upload' : '/media/upload';

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('folder', folder);

        // Get CSRF token from document if available
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
        };
        if (tokenMeta) {
            headers['X-CSRF-TOKEN'] = tokenMeta.getAttribute('content');
        }

        try {
            if (multiple) {
                files.forEach((file) => formData.append('files[]', file));
            } else {
                formData.append('file', files[0]);
            }

            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Media upload failed.');
            }

            if (multiple) {
                const newUrls = (data.files || []).map((f) => f.url);
                const current = Array.isArray(value) ? value : [];
                onChange([...current, ...newUrls]);
            } else {
                onChange(data.file.url);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload media from device.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const isVideoUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        return (
            url.match(/\.(mp4|webm|mov|mkv|ogg)$/i) ||
            url.includes('/video/') ||
            url.includes('youtube.com') ||
            url.includes('youtu.be')
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                    <span>{label}</span>
                </label>
                {helpText && <span className="text-[11px] text-slate-400">{helpText}</span>}
            </div>

            {/* Drop / Click Target */}
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    uploading
                        ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                Uploading media from your device to storage...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Click or drag to upload <span className="text-amber-500 font-bold">Photos or Videos</span>
                            </p>
                            <p className="text-[10px] text-slate-400">Optimized storage via MinIO / Cloud Object Volumes</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Single URL Preview */}
            {!multiple && value && typeof value === 'string' && (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 max-w-sm">
                    {isVideoUrl(value) ? (
                        <video src={value} controls className="w-full h-44 object-cover" />
                    ) : (
                        <img src={value} alt="Preview" className="w-full h-44 object-cover" />
                    )}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-slate-950/80 text-white hover:bg-red-600 rounded-full shadow transition-all"
                        title="Remove"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-white flex items-center space-x-1">
                        {isVideoUrl(value) ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                        <span className="truncate max-w-[200px]">{value}</span>
                    </div>
                </div>
            )}

            {/* Multiple URLs Previews */}
            {multiple && Array.isArray(value) && value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {value.map((item, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 h-28">
                            {isVideoUrl(item) ? (
                                <video src={item} className="w-full h-full object-cover" />
                            ) : (
                                <img src={item} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = value.filter((_, i) => i !== idx);
                                    onChange(updated);
                                }}
                                className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 text-white hover:bg-red-600 rounded-full shadow transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] text-white flex items-center space-x-1">
                                {isVideoUrl(item) ? <Video className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                                <span>#{idx + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
