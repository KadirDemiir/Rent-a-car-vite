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
            $table->json('name');         // İsim (TR/EN)
            $table->json('description');  // Açıklama (TR/EN)
            $table->integer('stock')->default(0);     // Elimizde kaç tane var?
            $table->integer('max_limit')->default(1); // Bir müşteri en fazla kaç tane kiralayabilir?
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
