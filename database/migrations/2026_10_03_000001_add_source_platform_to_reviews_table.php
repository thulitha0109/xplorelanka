<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // e.g. 'google', 'tripadvisor', 'booking', 'airbnb', 'direct'
            $table->string('source_platform')->default('google')->after('is_approved');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('source_platform');
        });
    }
};
