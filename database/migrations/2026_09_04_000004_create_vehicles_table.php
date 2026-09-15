<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_key')->unique(); // car, van, micro, bus
            $table->string('name');
            $table->string('seats');
            $table->string('rate_per_km');
            $table->decimal('base_rate_lkr', 10, 2)->default(0);
            $table->string('icon')->default('🚗');
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->boolean('driver_included')->default(true);
            $table->boolean('ac_available')->default(true);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
