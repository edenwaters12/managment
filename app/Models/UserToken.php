<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'refresh_token',
        'token_uri',
        'client_id',
        'client_secret',
        'scopes',
    ];
}
