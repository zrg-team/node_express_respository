<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Article extends Model
{
    use HasFactory;
    protected $table = 'articles';
    protected $fillable = [
        'title',
        'description',
        'user_id',
    ];
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    /**
     * Get the user that owns the article.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
