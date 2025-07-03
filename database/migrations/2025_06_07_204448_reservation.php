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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('surname');
            $table->string('tc_number', 11);
            $table->string('phone_number');
            $table->string('pickup_location');
            $table->string('return_location');
            $table->dateTime('pickup_datetime');
            $table->dateTime('return_datetime');
            $table->unsignedTinyInteger('rental_days'); 
            $table->decimal('daily_price', 10, 2);
            $table->decimal('extras_total', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->enum('payment_type', ['credit_card', 'cash', 'bank_transfer']);
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
