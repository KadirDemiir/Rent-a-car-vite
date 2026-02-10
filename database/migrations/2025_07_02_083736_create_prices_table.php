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
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_group_id')->constrained('car_groups')->onDelete('cascade');
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('cascade');
            $table->enum('month', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
            $table->unsignedSmallInteger('min_days');
            $table->unsignedSmallInteger('max_days');
            $table->decimal('price', 15, 2);
            $table->decimal('base_price', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['car_group_id', 'is_active', 'month', 'min_days', 'max_days'], 'prices_group_lookup_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prices');
    }
};
