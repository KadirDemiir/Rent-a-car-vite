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
        // Reservations table - critical for availability checks
        Schema::table('reservations', function (Blueprint $table) {
            // Index for location-based queries
            $table->index(['return_location_id', 'return_datetime'], 'reservations_return_location_idx');
        });

        // Discounts table
        Schema::table('discounts', function (Blueprint $table) {
            // Composite index for discount lookups
            $table->index(['status', 'start_date', 'end_date', 'min_days', 'max_days'], 'discounts_date_range_idx');
            $table->index(['target_type', 'segment_id'], 'discounts_target_segment_idx');
        });

        // Drop prices table
        Schema::table('drop_prices', function (Blueprint $table) {
            // Index for location pair lookups
            $table->index(['from_location_id', 'to_location_id'], 'drop_prices_locations_idx');
        });

        // Translations table - frequently queried
        Schema::table('translations', function (Blueprint $table) {
            $table->index(['language_id', 'translation_key_id'], 'translations_lookup_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex('reservations_return_location_idx');
        });

        Schema::table('discounts', function (Blueprint $table) {
            $table->dropIndex('discounts_date_range_idx');
            $table->dropIndex('discounts_target_segment_idx');
        });

        Schema::table('drop_prices', function (Blueprint $table) {
            $table->dropIndex('drop_prices_locations_idx');
        });

        Schema::table('translations', function (Blueprint $table) {
            $table->dropIndex('translations_lookup_idx');
        });
    }
};