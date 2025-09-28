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
            $table->foreignId('segment_id')->constrained('segments')->onDelete('restrict');
            $table->foreignId('fuel_id')->constrained('fuels')->onDelete('restrict');
            $table->foreignId('transmission_id')->constrained('transmissions')->onDelete('restrict');
            $table->foreignId('body_type_id')->constrained('body_types')->onDelete('restrict');
            $table->unsignedTinyInteger('seat_count');
            $table->unsignedSmallInteger('trunk_capacity');
            $table->decimal('price', 10, 2);
            $table->decimal('deposit', 10, 2);
            $table->char('price_currency', 3);
            $table->char('deposit_currency', 3);
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
