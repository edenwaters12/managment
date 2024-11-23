<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCdmiDataTable extends Migration
{
    public function up()
    {
        Schema::create('cdmi_data', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('isDelete')->default('False');;
            $table->json('files')->nullable(); // Store file paths as a JSON array
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cdmi_data');
    }
}