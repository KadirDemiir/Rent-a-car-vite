<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('car_groups', function (Blueprint $table) {
            $table->decimal('online_discount', 5, 2)->default(0)->after('deposit');
        });
    }

    public function down(): void
    {
        Schema::table('car_groups', function (Blueprint $table) {
            $table->dropColumn('online_discount');
        });
    }
};
