<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            [
                'page_id' => 1,
                'title' => json_encode(['tr' => 'Popüler Araçlar', 'en' => 'Popular Cars']),
                'description' => 'cars',
                'content' => json_encode([
                    'tr' => 'En çok tercih edilen konforlu ve ekonomik araçlarımızı keşfedin.',
                    'en' => 'Explore our most preferred comfortable and economic vehicles.'
                ]),
                'sort_order' => 1,
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'page_id' => 1,
                'title' => json_encode(['tr' => 'Popüler Lokasyonlar', 'en' => 'Popular Locations']),
                'description' => 'locations',
                'content' => json_encode([
                    'tr' => 'Türkiye genelindeki yaygın ofis ağımızla dilediğiniz her noktada hizmetinizdeyiz.',
                    'en' => 'We are at your service at any point with our wide office network across Turkey.'
                ]),
                'sort_order' => 2,
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'page_id' => 1,
                'title' => json_encode(['tr' => 'Kampanyalar', 'en' => 'Campaigns']),
                'description' => 'campaigns',
                'content' => json_encode([
                    'tr' => 'Yolculuğunuzu daha ekonomik hale getirecek güncel fırsatlara göz atın.',
                    'en' => 'Check out the current deals that will make your journey more economical.'
                ]),
                'sort_order' => 3,
                'is_active' => false,
                'is_default' => true,
            ]
        ];

        DB::table('sections')->insert($sections);
    }
}
