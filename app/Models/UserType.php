<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class UserType extends Model
{
    use HasFactory;
    protected $table = 'user_types';
    protected $fillable = [
        'code',
        'title',
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    // Define any relationships here if necessary
    // For example, if user_types has a one-to-many relationship with users:
    // public function users()
    // {
    //     return $this->hasMany(User::class);
    // }
}
