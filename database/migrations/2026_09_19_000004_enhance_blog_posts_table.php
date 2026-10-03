<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->integer('views_count')->default(0)->after('is_published');
            $table->integer('reading_time_min')->default(5)->after('views_count');
            $table->json('tags')->nullable()->after('reading_time_min');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'reading_time_min', 'tags']);
        });
    }
};
