<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('surname');
            $table->string('tc_number', 11);
            $table->string('phone_number');
            $table->foreignId('pickup_location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->foreignId('return_location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->dateTime('pickup_datetime');
            $table->dateTime('return_datetime');
            $table->unsignedTinyInteger('rental_days');
            $table->decimal('daily_price', 10, 2);
            $table->decimal('drop_price', 10, 2)->default(0);
            $table->decimal('extras_total', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_type')->nullable();
            $table->string('discount_target')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->string('email');
            $table->text('address');
            $table->dateTime('birthday');
            $table->string('arrival_flight_no')->nullable();
            $table->string('return_flight_no')->nullable();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->enum('payment_type', ['credit_card', 'cash', 'bank_transfer']);
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'active', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
