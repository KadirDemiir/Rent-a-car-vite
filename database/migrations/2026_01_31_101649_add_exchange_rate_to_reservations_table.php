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
    Schema::table('reservations', function (Blueprint $table) {
        $table->decimal('exchange_rate', 15, 8)->default(1)->after('currency_id');
        //$table->decimal('base_total_price', 15, 2)->after('total_price');
        //$table->string('base_currency_code', 3)->default('TRY')->after('base_total_price');
    });
}

public function down(): void
{
    Schema::table('reservations', function (Blueprint $table) {
        $table->dropColumn(['exchange_rate']);
    });
}
};
