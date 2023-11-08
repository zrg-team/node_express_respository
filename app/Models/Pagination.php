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
        'articles_per_page', // Added new fillable field
        'is_visible', // Added new fillable field
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // Define any other relationships here if necessary
}
