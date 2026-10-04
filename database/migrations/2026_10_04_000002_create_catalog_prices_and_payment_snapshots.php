<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_prices', function (Blueprint $table) {
            $table->id();
            $table->morphs('priceable');
            $table->string('unit', 40)->default('package');
            $table->char('currency', 3);
            $table->unsignedBigInteger('amount_minor');
            $table->char('source_currency', 3)->nullable();
            $table->decimal('source_amount', 14, 4)->nullable();
            $table->decimal('exchange_rate', 18, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['priceable_type', 'priceable_id', 'unit', 'currency'], 'catalog_price_unique');
            $table->index(['currency', 'is_active']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->char('country_code', 2)->nullable();
            $table->char('currency', 3)->default('USD');
            $table->unsignedBigInteger('quoted_total_minor')->nullable();
            $table->json('price_snapshot')->nullable();
            $table->string('payment_status', 30)->default('unpaid');
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 40);
            $table->string('provider_checkout_id')->nullable()->index();
            $table->string('provider_transaction_id')->nullable()->index();
            $table->string('idempotency_key', 100)->unique();
            $table->unsignedBigInteger('amount_minor');
            $table->char('currency', 3);
            $table->string('status', 30)->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['country_code', 'currency', 'quoted_total_minor', 'price_snapshot', 'payment_status']);
        });
        Schema::dropIfExists('catalog_prices');
    }
};
