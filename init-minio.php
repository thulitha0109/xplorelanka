<?php

$autoload = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoload)) {
    fwrite(STDERR, "Vendor autoload not found, skipping MinIO bucket initialization.\n");
    exit(0);
}

require $autoload;

use Aws\S3\S3Client;

$endpoint = getenv('AWS_ENDPOINT') ?: getenv('MINIO_ENDPOINT') ?: 'http://minio:9000';
$bucket = getenv('AWS_BUCKET') ?: 'xplorelanka';
$key = getenv('AWS_ACCESS_KEY_ID') ?: getenv('MINIO_ROOT_USER') ?: 'xplore_minio';
$secret = getenv('AWS_SECRET_ACCESS_KEY') ?: getenv('MINIO_ROOT_PASSWORD') ?: 'xplore_secret_key';
$region = getenv('AWS_DEFAULT_REGION') ?: 'us-east-1';

$client = new S3Client([
    'version' => 'latest',
    'region' => $region,
    'endpoint' => $endpoint,
    'use_path_style_endpoint' => true,
    'credentials' => [
        'key' => $key,
        'secret' => $secret,
    ],
]);

for ($attempt = 1; $attempt <= 20; $attempt++) {
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
    } catch (\Throwable $exception) {
        if ($attempt === 20) {
            fwrite(STDERR, "Could not initialize MinIO bucket '{$bucket}': {$exception->getMessage()}\n");
            exit(0); # Non-fatal for local dev
        }
        sleep(2);
    }
}
