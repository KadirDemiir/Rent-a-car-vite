<?php

namespace Database\Factories;

use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'location_id' => 1,
            'brand' => fake()->company(),
            'model' => fake()->word(),
            'year' => fake()->numberBetween(2010, 2024),
            'segment' => fake()->randomElement(['economy', 'midrange', 'premium']),
            'body_type' => fake()->randomElement(['Sedan', 'Hatchback', 'SUV', 'Coupe']),
            'seat_count' => fake()->numberBetween(2, 7),
            'price' => fake()->numberBetween(500, 5000),
            'price_currency' => fake()->randomElement(['TRY', 'USD', 'EUR']),
            'deposit' => fake()->numberBetween(1000, 10000),
            'deposit_currency' => fake()->randomElement(['TRY', 'USD', 'EUR']),
            'trunk_capacity' => fake()->numberBetween(200, 800),
            'fuel_type' => fake()->randomElement(['benzin', 'dizel']),
            'transmission_type' => fake()->randomElement(['manuel', 'otomatik']),
            'license_plate' => fake()->regexify('[0-9]{2} [A-Z]{1,3} [0-9]{2,4}'),
        ];
    }

    /**
     * Belirli bir location_id kullanmak için özel durum.
     */
    public function fromLocation(int $locationId): static
    {
        return $this->state(fn (array $attributes) => [
            'location_id' => $locationId,
        ]);
    }

    /**
     * Elektrikli araçlar için özel durum.
     */
    public function electric(): static
    {
        return $this->state(fn (array $attributes) => [
            'fuel_type' => 'Electric',
            'transmission_type' => 'Automatic',
        ]);
    }
    public function withPhotos(int $count = 1): static
    {
        return $this->afterCreating(function ($car) use ($count) {
            Photo::factory()->count($count)->create([
                'car_id' => $car->id,
            ]);
        });
    }
}
