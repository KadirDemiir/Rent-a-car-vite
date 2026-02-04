<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Photo;
use App\Models\Price;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    /**
     * Seed 40 dummy cars with photos and prices.
     */
    public function run(): void
    {
        $this->command->info('Creating 40 dummy cars with photos and prices...');

        // Create 40 cars with photos and prices
        $cars = Car::factory()
            ->count(40)
            ->withPrices()
            ->create();

        // Add photos for each car
        foreach ($cars as $car) {
            $photoCount = rand(1, 3);
            
            for ($i = 0; $i < $photoCount; $i++) {
                Photo::create([
                    'car_id' => $car->id,
                    'photo_path' => 'carPhotos/55l5nH6DTJBOb1oXklr1gZBMt8Qn40xEVmacBRZk.jpg',
                    'is_cover' => $i === 0,
                ]);
            }
        }

        $this->command->info('✓ 40 cars with photos and prices created successfully!');
    }
}
