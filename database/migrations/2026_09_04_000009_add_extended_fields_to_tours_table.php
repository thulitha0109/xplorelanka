<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tours', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('gallery');
            $table->json('waypoints')->nullable()->after('tags');           // [{name, lat, lng}]
            $table->string('video_url')->nullable()->after('waypoints');
            $table->decimal('map_center_lat', 10, 7)->nullable()->after('video_url');
            $table->decimal('map_center_lng', 10, 7)->nullable()->after('map_center_lat');
            $table->string('seo_title')->nullable()->after('map_center_lng');
            $table->string('seo_description')->nullable()->after('seo_title');
            $table->integer('max_group_size')->nullable()->after('seo_description');
            $table->string('difficulty')->nullable()->after('max_group_size'); // easy, moderate, challenging
        });
    }

    public function down(): void
    {
        Schema::table('tours', function (Blueprint $table) {
            $table->dropColumn([
                'tags', 'waypoints', 'video_url',
                'map_center_lat', 'map_center_lng',
                'seo_title', 'seo_description',
                'max_group_size', 'difficulty',
            ]);
        });
    }
};
