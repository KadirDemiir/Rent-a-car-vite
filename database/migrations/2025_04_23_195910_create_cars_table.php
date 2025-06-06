<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->string('brand');
            $table->string('model');
            $table->year('year');

            $table->enum('segment', [
                'economy', 'compact', 'midrange', 'premium'
            ]);

            $table->enum('body_type', [
                'hatchback', 'sedan', 'suv', 'station', 'coupe', 'convertible', 'minivan', 'pickup'
            ]);

            $table->unsignedTinyInteger('seat_count');
            $table->unsignedSmallInteger('trunk_capacity');

            $table->enum('fuel_type', [
                'benzin', 'dizel', 'elektrik', 'hibrit'
            ]);

            $table->enum('transmission_type', [
                'manuel', 'otomatik'
            ]);

            $table->string('license_plate');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
