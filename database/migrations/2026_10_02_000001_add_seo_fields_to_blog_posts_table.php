<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('blog_posts', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('category');
            }
            if (!Schema::hasColumn('blog_posts', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('blog_posts', 'meta_keywords')) {
                $table->string('meta_keywords')->nullable()->after('meta_description');
            }
            if (!Schema::hasColumn('blog_posts', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_keywords');
            }
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['meta_title', 'meta_description', 'meta_keywords', 'canonical_url']);
        });
    }
};
