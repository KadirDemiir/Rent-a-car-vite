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
        Schema::create('extra_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('one_three_day_price', 8, 2)->nullable();
            $table->decimal('four_seven_day_price', 8, 2)->nullable();
            $table->decimal('eight_fifteen_day_price', 8, 2)->nullable();
            $table->decimal('more_than_fifteen_day_price', 8, 2)->nullable();
            $table->integer('stock')->nullable();
            $table->integer('max_limit')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extra_services');
    }
};
