<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accommodations', function (Blueprint $table) {
            $table->foreignId('partner_id')->nullable()->constrained('partners')->nullOnDelete()->after('id');
            $table->json('gallery')->nullable()->after('image');
            $table->json('room_types')->nullable()->after('amenities');
            $table->decimal('latitude', 10, 7)->nullable()->after('location');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('contact_phone')->nullable()->after('description');
            $table->string('contact_email')->nullable()->after('contact_phone');
            $table->boolean('is_featured')->default(false)->after('is_available');
        });
    }

    public function down(): void
    {
        Schema::table('accommodations', function (Blueprint $table) {
            $table->dropForeign(['partner_id']);
            $table->dropColumn([
                'partner_id',
                'gallery',
                'room_types',
                'latitude',
                'longitude',
                'contact_phone',
                'contact_email',
                'is_featured',
            ]);
        });
    }
};
