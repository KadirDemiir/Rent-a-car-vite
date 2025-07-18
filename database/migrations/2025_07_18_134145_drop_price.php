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
        Schema::create('drop_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_location_id')->constrained('locations')->cascadeOnDelete();
            $table->foreignId('to_location_id')->constrained('locations')->cascadeOnDelete();
            $table->unique(['from_location_id', 'to_location_id']);
            $table->string('currency', 3)->default('eur');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        schema::dropIfExists('drop_prices');
    }
};
