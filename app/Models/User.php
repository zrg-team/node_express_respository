<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class User extends Model
{
    use HasFactory;
    protected $table = 'users';
    protected $fillable = [
        'id',
        'user_name',
        'password',
        'status',
        'createdat',
        'updatedat',
        'avatar',
        'avatar_file_id',
        'created_at',
        'updated_at'
    ];
}
