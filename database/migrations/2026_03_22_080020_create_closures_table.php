<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('closures', function (Blueprint $table) {
            $table->id();
            $table->timestamp('start_at');
            $table->timestamp('end_at');
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->index(['start_at', 'end_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('closures');
    }
};
