<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('camping_locations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('location');
            $table->string('image')->nullable();
            $table->json('types')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('durations')->nullable();
            $table->json('add_ons')->nullable();
            $table->text('description')->nullable();
            $table->decimal('starting_price_lkr', 12, 2)->default(15000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('camping_locations');
    }
};
