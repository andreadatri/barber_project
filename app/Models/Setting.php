<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'key',
        'value',
    ];

    public static function getMany(array $defaults): array
    {
        $stored = static::query()
            ->whereIn('key', array_keys($defaults))
            ->pluck('value', 'key')
            ->all();

        return array_replace($defaults, array_filter(
            $stored,
            static fn (?string $value): bool => $value !== null && $value !== ''
        ));
    }

    public static function putMany(array $values): void
    {
        foreach ($values as $key => $value) {
            static::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value === '' ? null : $value],
            );
        }
    }
}
