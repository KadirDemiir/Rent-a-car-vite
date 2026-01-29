<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'body',
        'variables',
        'is_active',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    public function render(array $data = []): array
    {
        $lang = $data['lang'] ?? $data['locale'] ?? null;
        $subject = $this->resolveLocalizedField($this->subject, $lang);
        $body = $this->resolveLocalizedField($this->body, $lang);

        foreach ($data as $key => $value) {
            if ($key === 'lang' || $key === 'locale') {
                continue;
            }
            $subject = str_replace('{{' . $key . '}}', $value, $subject);
            $body = str_replace('{{' . $key . '}}', $value, $body);
        }

        return [
            'subject' => $subject,
            'body' => $body,
        ];
    }

    private function resolveLocalizedField($value, ?string $lang = null): string
    {
        $localized = $this->decodeLocalizedField($value);
        if (is_array($localized)) {
            if ($lang && isset($localized[$lang]) && trim($localized[$lang]) !== '') {
                return $localized[$lang];
            }
            $first = collect($localized)->first(fn($v) => trim((string)$v) !== '');
            return $first ?? '';
        }

        return (string) $value;
    }

    private function decodeLocalizedField($value): ?array
    {
        if (is_array($value)) {
            return $value;
        }

        if (!is_string($value)) {
            return null;
        }

        try {
            $decoded = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
            return is_array($decoded) ? $decoded : null;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
