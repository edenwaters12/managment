<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('null');
            $table->rememberToken();
            $table->timestamps();
        });
        \App\Models\User::create([
            'name' => 'dhruvish',
            'email' => 'dhruvish@gmail.com',
            'username' => 'dhruvish',
            'password' => '$2y$10$H4YrorDBzZj2j1k13DGPEupDqxApOeMplKBS74XMGqgM/lrcvf6R2',
            'remember_token' => Str::random(10),
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
