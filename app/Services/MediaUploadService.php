<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class MediaUploadService
{
    /**
     * Allowed mime types
     */
    protected array $imageMimes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    ];

    protected array $videoMimes = [
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/mpeg',
    ];

    /**
     * Upload a single media file (image or video) to the configured storage disk.
     *
     * Files are streamed to S3/MinIO — never loaded fully into PHP memory.
     * Throws on any error so callers can decide how to handle the failure.
     *
     * @return array{url: string, path: string, disk: string, media_type: string, mime_type: string, size: int, original_name: string}
     *
     * @throws \InvalidArgumentException  For invalid type or size.
     * @throws \RuntimeException          For misconfigured storage or upload failure.
     */
    public function upload(UploadedFile $file, string $folder = 'general'): array
    {
        $mime      = $file->getMimeType() ?: $file->getClientMimeType();
        $size      = $file->getSize();
        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $isImage   = in_array($mime, $this->imageMimes, true) || str_starts_with($mime, 'image/');
        $isVideo   = in_array($mime, $this->videoMimes, true) || str_starts_with($mime, 'video/');

        if (! $isImage && ! $isVideo) {
            throw new \InvalidArgumentException("Unsupported file type: {$mime}. Only images and videos are allowed.");
        }

        // Size limits: 50 MB for video, 12 MB for images
        $maxBytes = $isVideo ? 52_428_800 : 12_582_912;
        if ($size > $maxBytes) {
            $limitMb = $isVideo ? '50MB' : '12MB';
            throw new \InvalidArgumentException("File size ({$size} bytes) exceeds the {$limitMb} limit.");
        }

        $mediaType    = $isVideo ? 'video' : 'image';
        $directory    = "uploads/{$folder}/" . date('Y/m');
        $filename     = Str::uuid()->toString() . '.' . $extension;
        $relativePath = "{$directory}/{$filename}";
        $disk         = $this->resolveDisk();

        try {
            // Stream the file via Laravel's putFileAs — avoids loading the entire file into PHP memory.
            $stored = Storage::disk($disk)->putFileAs($directory, $file, $filename, [
                'visibility'  => 'public',
                'ContentType' => $mime,
            ]);

            if (! $stored) {
                throw new RuntimeException("Storage::putFileAs returned false for disk '{$disk}' at '{$relativePath}'.");
            }

            $url = Storage::disk($disk)->url($stored);
        } catch (\Throwable $e) {
            Log::error('MediaUploadService: upload failed', [
                'disk'      => $disk,
                'path'      => $relativePath,
                'mime'      => $mime,
                'size'      => $size,
                'message'   => $e->getMessage(),
                'exception' => $e,
            ]);

            throw $e;
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
     * Delete a file from the storage disk by its path or URL.
     * Safe to call with null, relative paths, or full URLs.
     * Automatically extracts the relative upload path and ignores external URLs (e.g. YouTube, Unsplash).
     */
    public function delete(?string $pathOrUrl): bool
    {
        if (blank($pathOrUrl)) {
            return false;
        }

        // If it contains 'uploads/', extract the relative storage path
        if (str_contains($pathOrUrl, 'uploads/')) {
            $relativePath = substr($pathOrUrl, strpos($pathOrUrl, 'uploads/'));
        } elseif (! str_contains($pathOrUrl, '://')) {
            // Bare relative path without 'uploads/' prefix
            $relativePath = ltrim($pathOrUrl, '/');
        } else {
            // External URL (e.g., YouTube video, external CDN / Unsplash placeholder) — do not delete
            return false;
        }

        try {
            $disk = $this->resolveDisk();
            return Storage::disk($disk)->delete($relativePath);
        } catch (\Throwable $e) {
            Log::warning('MediaUploadService::delete() failed', [
                'path'    => $relativePath ?? $pathOrUrl,
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Resolve which storage disk to use.
     *
     * Reads FILESYSTEM_DISK from config. If it resolves to 's3', validates that
     * the minimum required S3/MinIO credentials are present and throws if not.
     * Never silently falls back to the local public disk in production.
     */
    protected function resolveDisk(): string
    {
        $disk = config('filesystems.default', 'local');

        if ($disk === 's3') {
            $this->assertS3Configured();
        }

        return $disk;
    }

    /**
     * Assert that the S3/MinIO disk has the minimum required configuration.
     *
     * @throws \RuntimeException
     */
    protected function assertS3Configured(): void
    {
        $required = [
            'filesystems.disks.s3.key'    => 'AWS_ACCESS_KEY_ID',
            'filesystems.disks.s3.secret' => 'AWS_SECRET_ACCESS_KEY',
            'filesystems.disks.s3.bucket' => 'AWS_BUCKET',
            'filesystems.disks.s3.region' => 'AWS_DEFAULT_REGION',
        ];

        $missing = [];
        foreach ($required as $configKey => $envKey) {
            if (blank(config($configKey))) {
                $missing[] = $envKey;
            }
        }

        if (! empty($missing)) {
            throw new RuntimeException(
                'S3/MinIO storage is configured as the default disk (FILESYSTEM_DISK=s3) '
                . 'but the following environment variables are missing or empty: '
                . implode(', ', $missing)
                . '. Set them in .env before uploading files.'
            );
        }
    }
}
