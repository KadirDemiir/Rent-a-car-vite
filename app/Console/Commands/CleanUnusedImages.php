<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Section;

class CleanUnusedImages extends Command
{
    protected $signature = 'images:clean';
    protected $description = 'Veritabanında karşılığı olmayan resimleri diskten siler';

    public function handle()
    {
        $allFiles = Storage::disk('public')->allFiles('uploads/sections');
        $sections = Section::all();
        $usedImages = [];

// Veritabanındaki tüm içerikleri tara ve resim URL'lerini topla
        foreach ($sections as $section) {
            foreach ($section->content as $html) {
                if (empty($html)) continue;
// Regex ile /storage/uploads/sections/abc.jpg formatındaki yolları bul
                preg_match_all('/\/storage\/(uploads\/sections\/[^\s"\']+)/', $html, $matches);
                if (!empty($matches[1])) {
                    $usedImages = array_merge($usedImages, $matches[1]);
                }
            }
        }

        $usedImages = array_unique($usedImages);
        $deletedCount = 0;

        foreach ($allFiles as $file) {
            if (!in_array($file, $usedImages)) {
                Storage::disk('public')->delete($file);
                $deletedCount++;
            }
        }

        $this->info("Temizlik tamamlandı: {$deletedCount} adet yetim dosya silindi.");
    }
}
