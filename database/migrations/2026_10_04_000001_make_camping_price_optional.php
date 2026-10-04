<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('camping_locations', function (Blueprint $table) {
            $table->decimal('starting_price_lkr', 12, 2)->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('camping_locations', function (Blueprint $table) {
            $table->decimal('starting_price_lkr', 12, 2)->nullable(false)->default(15000)->change();
        });
    }
};