<?php

require dirname(__DIR__, 2).'/vendor/autoload.php';

use Aws\S3\S3Client;

$bucket = getenv('AWS_BUCKET') ?: 'xplorelanka';
$client = new S3Client([
    'version' => 'latest',
    'region' => getenv('AWS_DEFAULT_REGION') ?: 'us-east-1',
    'endpoint' => getenv('AWS_ENDPOINT') ?: 'http://minio:9000',
    'use_path_style_endpoint' => filter_var(getenv('AWS_USE_PATH_STYLE_ENDPOINT') ?: 'true', FILTER_VALIDATE_BOOL),
    'credentials' => [
        'key' => getenv('AWS_ACCESS_KEY_ID') ?: 'xplore_minio',
        'secret' => getenv('AWS_SECRET_ACCESS_KEY') ?: 'xplore_secret_key',
    ],
]);

for ($attempt = 1; $attempt <= 30; $attempt++) {
    try {
        if (!$client->doesBucketExistV2($bucket)) {
            $client->createBucket(['Bucket' => $bucket]);
        }

        $client->putBucketPolicy([
            'Bucket' => $bucket,
            'Policy' => json_encode([
                'Version' => '2012-10-17',
                'Statement' => [[
                    'Effect' => 'Allow',
                    'Principal' => '*',
                    'Action' => ['s3:GetObject'],
                    'Resource' => ["arn:aws:s3:::{$bucket}/*"],
                ]],
            ], JSON_THROW_ON_ERROR),
        ]);

        fwrite(STDOUT, "MinIO bucket '{$bucket}' is ready with public read access.\n");
        exit(0);
    } catch (Throwable $exception) {
        if ($attempt === 30) {
            fwrite(STDERR, "Could not initialize MinIO bucket '{$bucket}': {$exception->getMessage()}\n");
            exit(1);
        }
        sleep(2);
    }
}
