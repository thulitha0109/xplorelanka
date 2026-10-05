<?php

namespace App\Models\Concerns;

use App\Services\MediaUploadService;

trait HasMediaCleanup
{
    /**
     * Boot the trait and register the deleted event to clean up media files from MinIO / S3.
     */
    public static function bootHasMediaCleanup(): void
    {
        static::deleted(function ($model) {
            $service = app(MediaUploadService::class);
            $fields = $model->getMediaFields();

            foreach ($fields as $field) {
                $val = $model->{$field};
                if (is_array($val)) {
                    foreach ($val as $url) {
                        if (is_string($url)) {
                            $service->delete($url);
                        }
                    }
                } elseif (is_string($val)) {
                    $service->delete($val);
                }
            }
        });
    }

    /**
     * Return array of attribute names that contain media paths or URLs.
     * Models can override this or set a $mediaFields property.
     *
     * @return array<string>
     */
    public function getMediaFields(): array
    {
        return property_exists($this, 'mediaFields') ? $this->mediaFields : ['image', 'gallery'];
    }
}
