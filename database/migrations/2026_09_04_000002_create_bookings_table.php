<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();
            $table->string('type')->default('tour'); // tour, vehicle, camping, custom
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('country')->nullable();
            $table->foreignId('tour_id')->nullable()->constrained('tours')->nullOnDelete();
            $table->string('pickup_location')->nullable();
            $table->string('dropoff_location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('guests_count')->default(1);
            $table->string('vehicle_type')->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
