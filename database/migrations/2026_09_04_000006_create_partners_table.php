<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('partner_type'); // vehicle_owner, accommodation_owner, place_owner, tour_guide
            $table->string('location');
            $table->string('vehicle_or_property_details')->nullable();
            $table->decimal('rate_lkr', 12, 2)->nullable();
            $table->decimal('rating', 3, 2)->default(4.9);
            $table->text('message')->nullable();
            $table->string('status')->default('approved'); // pending, approved, rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
