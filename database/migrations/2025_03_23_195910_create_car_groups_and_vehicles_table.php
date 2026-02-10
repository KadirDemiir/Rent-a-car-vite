<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->foreignId('segment_id')->constrained('segments')->onDelete('restrict');
            $table->string('cover_image')->nullable();
            $table->decimal('deposit', 10, 2);
            $table->json('features')->nullable();
            $table->foreignId('transmission_id')->constrained('transmissions')->onDelete('restrict');
            $table->foreignId('fuel_id')->constrained('fuels')->onDelete('restrict');
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('restrict');
            $table->foreignId('body_type_id')->constrained('body_types')->onDelete('restrict');
            $table->unsignedTinyInteger('seat_count');
            $table->unsignedSmallInteger('trunk_capacity');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['sort_order'], 'car_groups_sort_idx');
        });

        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_group_id')->constrained('car_groups')->onDelete('cascade');
            $table->string('plate_number');
            $table->year('exact_year');
            //$table->string('chassis_number')->nullable();
            $table->foreignId('brand_translation_key_id')->constrained('translation_keys')->onDelete('cascade');
            $table->foreignId('model_translation_key_id')->constrained('translation_keys')->onDelete('cascade');
            $table->unsignedInteger('current_km')->nullable();
            $table->enum('status', ['available', 'rented', 'unavailable'])->default('available');
            $table->foreignId('current_location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->timestamps();

            $table->index(['car_group_id', 'status'], 'vehicles_group_status_idx');
            $table->index('current_location_id', 'vehicles_location_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('car_groups');
    }
};
