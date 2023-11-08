<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
class User extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'users';
    protected $fillable = [
        'username', // updated column name to match the new code
        'password',
        'status',
        'avatar',
    ];
    protected $hidden = [
        'password', // Keep the hidden attribute from the existing code
    ];
    protected $dates = [
        'created_at',
        'updated_at',
        'logged_in', // added new date column from the new code
    ];
    // Keep the setPasswordAttribute mutator from the existing code
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }
    // Define relationships
    public function articles()
    {
        return $this->hasMany(Article::class, 'user_id');
    }
    // Assuming that the User model should also have a relationship with UserType
    // and that the UserType model exists and is related to the User model.
    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }
}
