<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 15, 2)->default(0);
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->cascadeOnDelete();
            $table->enum('target_type', ['segment', 'car', 'all']);
            $table->integer('min_days');
            $table->integer('max_days');
            $table->foreignId('car_id')->nullable()->constrained('cars')->cascadeOnDelete();
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('segment_id')->nullable()->constrained('segments')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
