<?php

namespace App\Http\Controllers;

use App\Services\MediaUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(
        protected MediaUploadService $uploadService
    ) {}

    /**
     * Upload single or multiple media files (photos or videos)
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file'   => 'nullable|file|max:52428', // 50MB
            'files'  => 'nullable|array',
            'files.*'=> 'file|max:52428',
            'folder' => 'nullable|string|max:50',
        ]);

        $folder = $request->input('folder', 'general');

        try {
            if ($request->hasFile('file')) {
                $result = $this->uploadService->upload($request->file('file'), $folder);
                return response()->json([
                    'success' => true,
                    'file'    => $result,
                ]);
            }

            if ($request->hasFile('files')) {
                $results = [];
                foreach ($request->file('files') as $uploaded) {
                    $results[] = $this->uploadService->upload($uploaded, $folder);
                }
                return response()->json([
                    'success' => true,
                    'files'   => $results,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No media file was uploaded.',
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
