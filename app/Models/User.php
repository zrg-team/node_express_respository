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
        'username',
        'password',
        'status',
        'avatar',
        'logged_in', // Added from new code
    ];
    protected $hidden = [
        'password', // Keep the hidden attribute from the existing code
    ];
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at', // Added from new code assuming soft deletes are used and 'deleted_at' column exists
    ];
    protected $casts = [
        'logged_in' => 'boolean', // Added from new code to ensure 'logged_in' is cast to boolean
    ];
    // Keep the setPasswordAttribute mutator from the existing code
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }
    // Relationships
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
    // Define any other relationships here if necessary
}
