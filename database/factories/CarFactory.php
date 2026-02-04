<?php

namespace Database\Factories;

use App\Models\BodyType;
use App\Models\Currency;
use App\Models\Fuel;
use App\Models\Locations;
use App\Models\Photo;
use App\Models\Price;
use App\Models\Segment;
use App\Models\Transmission;
use App\Models\TranslationKey;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    // Common car brands and models
    protected static array $carData = [
        'Toyota' => ['Corolla', 'Camry', 'RAV4', 'Yaris', 'C-HR', 'Land Cruiser'],
        'Honda' => ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V', 'Pilot'],
        'BMW' => ['3 Series', '5 Series', 'X3', 'X5', '1 Series', 'X1'],
        'Mercedes' => ['C-Class', 'E-Class', 'A-Class', 'GLC', 'GLE', 'S-Class'],
        'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc', 'Arteon'],
        'Audi' => ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
        'Ford' => ['Focus', 'Fiesta', 'Kuga', 'Puma', 'Mustang', 'Explorer'],
        'Hyundai' => ['i20', 'i30', 'Tucson', 'Kona', 'Santa Fe', 'Elantra'],
        'Renault' => ['Clio', 'Megane', 'Captur', 'Kadjar', 'Talisman', 'Koleos'],
        'Fiat' => ['500', 'Panda', 'Tipo', 'Egea', '500X', 'Doblo'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brand = $this->fake()->randomElement(array_keys(self::$carData));
        $model = $this->fake()->randomElement(self::$carData[$brand]);
        $location = Locations::inRandomOrder()->first();

        return [
            'location_id' => $location?->id ?? 1,
            'current_location_id' => $location?->id ?? 1,
            'brand_translation_key_id' => $this->getOrCreateTranslationKey($brand),
            'model_translation_key_id' => $this->getOrCreateTranslationKey($model),
            'year' => $this->fake()->numberBetween(2018, 2025),
            'segment_id' => Segment::inRandomOrder()->first()?->id ?? 1,
            'body_type_id' => BodyType::inRandomOrder()->first()?->id ?? 1,
            'seat_count' => $this->fake()->randomElement([2, 4, 5, 7]),
            'currency_id' => Currency::inRandomOrder()->first()?->id ?? 1,
            'deposit' => $this->fake()->randomElement([1000, 1500, 2000, 2500, 3000, 5000]),
            'trunk_capacity' => $this->fake()->numberBetween(200, 600),
            'fuel_id' => Fuel::inRandomOrder()->first()?->id ?? 1,
            'transmission_id' => Transmission::inRandomOrder()->first()?->id ?? 1,
            'status' => $this->fake()->randomElement(['available', 'available', 'available', 'rented', 'unavailable']),
            'license_plate' => $this->fake()->regexify('[0-9]{2} [A-Z]{1,3} [0-9]{2,4}'),
            'sort_order' => $this->fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Get or create a translation key for car brand/model
     */
    protected function getOrCreateTranslationKey(string $value): int
    {
        $key = TranslationKey::firstOrCreate(
            ['key' => $value],
            ['key' => $value]
        );
        return $key->id;
    }

    /**
     * Use a specific location_id.
     */
    public function fromLocation(int $locationId): static
    {
        return $this->state(fn (array $attributes) => [
            'location_id' => $locationId,
            'current_location_id' => $locationId,
        ]);
    }

    /**
     * Create with photos.
     */
    public function withPhotos(int $count = 1): static
    {
        return $this->afterCreating(function ($car) use ($count) {
            Photo::factory()->count($count)->create([
                'car_id' => $car->id,
            ]);
        });
    }

    /**
     * Create with prices for all months.
     */
    public function withPrices(): static
    {
        return $this->afterCreating(function ($car) {
            $basePrice = $this->fake()->randomElement([500, 750, 1000, 1250, 1500, 2000, 2500, 3000]);
            $currencyId = $car->currency_id;

            // Create prices for all 12 months with different day ranges
            for ($month = 1; $month <= 12; $month++) {
                // 1-3 days
                Price::create([
                    'car_id' => $car->id,
                    'currency_id' => $currencyId,
                    'month' => (string) $month,
                    'min_days' => 1,
                    'max_days' => 3,
                    'base_price' => $basePrice,
                    'price' => $basePrice,
                    'is_active' => true,
                ]);

                // 4-7 days (10% discount)
                Price::create([
                    'car_id' => $car->id,
                    'currency_id' => $currencyId,
                    'month' => (string) $month,
                    'min_days' => 4,
                    'max_days' => 7,
                    'base_price' => $basePrice,
                    'price' => round($basePrice * 0.9, 2),
                    'is_active' => true,
                ]);

                // 8-30 days (20% discount)
                Price::create([
                    'car_id' => $car->id,
                    'currency_id' => $currencyId,
                    'month' => (string) $month,
                    'min_days' => 8,
                    'max_days' => 30,
                    'base_price' => $basePrice,
                    'price' => round($basePrice * 0.8, 2),
                    'is_active' => true,
                ]);
            }
        });
    }
}
