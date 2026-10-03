<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->foreignId('partner_id')->nullable()->constrained('partners')->nullOnDelete()->after('id');
            $table->string('vehicle_category')->default('van')->after('vehicle_key'); // sedan, suv, van, micro_bus, coach, jeep, tuktuk
            $table->integer('luggage_capacity')->default(4)->after('seats');
            $table->string('transmission')->default('Automatic')->after('luggage_capacity');
            $table->string('fuel_type')->default('Diesel')->after('transmission');
            $table->decimal('daily_rate_lkr', 12, 2)->default(0)->after('base_rate_lkr');
            $table->json('pricing_tiers')->nullable()->after('daily_rate_lkr'); // airport transfers, per day, discount tiers
            $table->json('gallery')->nullable()->after('image');
            $table->integer('fleet_count')->default(1)->after('ac_available');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['partner_id']);
            $table->dropColumn([
                'partner_id',
                'vehicle_category',
                'luggage_capacity',
                'transmission',
                'fuel_type',
                'daily_rate_lkr',
                'pricing_tiers',
                'gallery',
                'fleet_count',
            ]);
        });
    }
};
