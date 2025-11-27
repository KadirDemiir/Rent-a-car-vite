<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('extra_service_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('extra_service_id')
                ->constrained('extra_services')
                ->onDelete('cascade');
            $table->integer('min_days')->unsigned(); // Örn: 1
            $table->integer('max_days')->unsigned(); // Örn: 3
            $table->decimal('price', 10, 2);         // Örn: 150.00
            $table->string('currency', 3)->default('TRY');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extra_service_prices');
    }
};
