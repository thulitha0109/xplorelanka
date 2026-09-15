<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category'); // e.g. cultural, nature, wildlife, beach, adventure, day, camping
            $table->string('route');
            $table->string('duration');
            $table->decimal('price_lkr', 12, 2);
            $table->decimal('price_usd', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('highlights')->nullable();
            $table->json('itinerary')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->decimal('rating', 3, 2)->default(4.9);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
