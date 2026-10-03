<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadService
{
    /**
     * Allowed mime types and extensions
     */
    protected array $imageMimes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'
    ];

    protected array $videoMimes = [
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/mpeg'
    ];

    /**
     * Upload an individual media file (image or video)
     */
    public function upload(UploadedFile $file, string $folder = 'general'): array
    {
        $mime = $file->getMimeType() ?: $file->getClientMimeType();
        $size = $file->getSize();
        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $isImage = in_array($mime, $this->imageMimes) || str_starts_with($mime, 'image/');
        $isVideo = in_array($mime, $this->videoMimes) || str_starts_with($mime, 'video/');

        if (!$isImage && !$isVideo) {
            throw new \InvalidArgumentException("Invalid file type: {$mime}. Only images and videos are allowed.");
        }

        $mediaType = $isVideo ? 'video' : 'image';

        // Maximum size validation: 50MB for videos, 12MB for images
        $maxBytes = $isVideo ? 52428800 : 12582912;
        if ($size > $maxBytes) {
            $limitMb = $isVideo ? '50MB' : '12MB';
            throw new \InvalidArgumentException("File size exceeds the limit of {$limitMb}.");
        }

        $filename = Str::uuid()->toString() . '.' . $extension;
        $relativePath = "uploads/{$folder}/" . date('Y/m') . "/{$filename}";

        // Check if S3 / MinIO disk is available and configured, fallback to public disk
        $disk = $this->determineDisk();

        try {
            Storage::disk($disk)->put($relativePath, file_get_contents($file->getRealPath()), [
                'visibility' => 'public',
                'ContentType' => $mime,
            ]);

            $url = Storage::disk($disk)->url($relativePath);

            // If using public local disk, ensure proper full URL
            if ($disk === 'public' && !str_starts_with($url, 'http')) {
                $url = asset('storage/' . $relativePath);
            }
        } catch (\Throwable $e) {
            Log::warning("Storage on disk '{$disk}' failed ({$e->getMessage()}), falling back to public disk.");
            $disk = 'public';
            Storage::disk('public')->put($relativePath, file_get_contents($file->getRealPath()), 'public');
            $url = asset('storage/' . $relativePath);
        }

        return [
            'url'           => $url,
            'path'          => $relativePath,
            'disk'          => $disk,
            'media_type'    => $mediaType,
            'mime_type'     => $mime,
            'size'          => $size,
            'original_name' => $file->getClientOriginalName(),
        ];
    }

    /**
     * Determine storage disk based on MinIO / S3 availability
     */
    protected function determineDisk(): string
    {
        $defaultDisk = config('filesystems.default', 'public');

        if ($defaultDisk === 's3') {
            return 's3';
        }

        // If S3 credentials/bucket are configured, test or use s3
        if (!empty(config('filesystems.disks.s3.bucket')) && !empty(config('filesystems.disks.s3.key'))) {
            return 's3';
        }

        return 'public';
    }
}
