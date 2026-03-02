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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->foreignId('slug_translation_key_id')->constrained('translation_keys')->cascadeOnDelete();
            $table->json('content');
            $table->string('cover_photo_path')->nullable();
            $table->json('meta_title');
            $table->json('meta_description');
            $table->json('meta_keywords');
            $table->boolean('is_active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
