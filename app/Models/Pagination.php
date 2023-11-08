<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Pagination extends Model
{
    use HasFactory;
    protected $table = 'paginations';
    protected $fillable = [
        'current_page',
        'per_page',
        'total_pages',
        'has_pagination',
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    // Assuming there is a relationship where Pagination belongs to a User
    // and the 'user_id' foreign key is present in the 'paginations' table.
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // Define any other relationships here if necessary
}
