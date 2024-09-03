<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'Today_date',
        'start_time',
        'end_time',
        'category',
    ];
}
