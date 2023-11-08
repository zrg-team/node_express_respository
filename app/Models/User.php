<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class User extends Model
{
    use SoftDeletes;
    protected $table = 'users';
    protected $fillable = [
        'user_name',
        'password',
        'status',
        'avatar',
    ];
    protected $hidden = [
        'password',
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }
}
