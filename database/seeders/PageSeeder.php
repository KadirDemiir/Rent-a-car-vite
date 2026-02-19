<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'route_group_name' => 'home',
                'title' => [
                    'tr' => 'Ana Sayfa',
                    'en' => 'Home'
                ],
                'meta_title' => [
                    'tr' => 'En İyi Araç Kiralama | Rent A Car',
                    'en' => 'Best Car Rental | Rent A Car'
                ],
                'meta_description' => [
                    'tr' => 'Uygun fiyatlı ve güvenilir araç kiralama hizmeti ile yola çıkın.',
                    'en' => 'Hit the road with affordable and reliable car rental services.'
                ],
                'meta_keywords' => [
                    'tr' => 'araç kiralama, rent a car, ucuz araç',
                    'en' => 'car rental, rent a car, cheap car'
                ],
                'is_active' => true,
                'is_system' => true,
            ],
            [
                'route_group_name' => 'auth',
                'title' => [
                    'tr' => 'Kullanıcı İşlemleri',
                    'en' => 'User Authentication'
                ],
                'meta_title' => [
                    'tr' => 'Giriş Yap veya Kayıt Ol | Rent A Car',
                    'en' => 'Login or Register | Rent A Car'
                ],
                'meta_description' => [
                    'tr' => 'Araç kiralamak ve rezervasyonlarınızı yönetmek için hesabınıza giriş yapın.',
                    'en' => 'Log in to your account to rent a car and manage your reservations.'
                ],
                'meta_keywords' => [
                    'tr' => 'giriş yap, kayıt ol, üye ol',
                    'en' => 'login, register, sign up'
                ],
                'is_active' => true,
                'is_system' => true,
            ],
            [
                'route_group_name' => 'reservation-search',
                'title' => [
                    'tr' => 'Araç Arama',
                    'en' => 'Search Cars'
                ],
                'meta_title' => [
                    'tr' => 'Size En Uygun Aracı Bulun',
                    'en' => 'Find the Best Car for You'
                ],
                'meta_description' => [
                    'tr' => 'Tarih ve lokasyon bilgilerinizi girerek kiralık araçları listeleyin.',
                    'en' => 'List rental cars by entering your date and location information.'
                ],
                'meta_keywords' => [
                    'tr' => 'araç ara, kiralık araç bul',
                    'en' => 'search car, find rental car'
                ],
                'is_active' => true,
                'is_system' => true,
            ],
            [
                'route_group_name' => 'reservation-create',
                'title' => [
                    'tr' => 'Rezervasyon Oluştur',
                    'en' => 'Create Reservation'
                ],
                'meta_title' => [
                    'tr' => 'Hemen Rezervasyon Yapın',
                    'en' => 'Book Now'
                ],
                'meta_description' => [
                    'tr' => 'Seçtiğiniz araç için güvenli ve hızlı bir şekilde rezervasyonunuzu tamamlayın.',
                    'en' => 'Complete your reservation safely and quickly for your selected car.'
                ],
                'meta_keywords' => [
                    'tr' => 'rezervasyon yap, araç kirala',
                    'en' => 'book a car, rent a car'
                ],
                'is_active' => true,
                'is_system' => true,
            ],
            [
                'route_group_name' => 'cars',
                'title' => [
                    'tr' => 'Araçlarımız',
                    'en' => 'Our Cars'
                ],
                'meta_title' => [
                    'tr' => 'Kiralık Araç Filomuz | Rent A Car',
                    'en' => 'Our Rental Car Fleet | Rent A Car'
                ],
                'meta_description' => [
                    'tr' => 'İhtiyacınıza en uygun kiralık araçları inceleyin ve hemen rezervasyon yapın.',
                    'en' => 'Browse the best rental cars for your needs and book now.'
                ],
                'meta_keywords' => [
                    'tr' => 'araç kiralama, kiralık araba, oto kiralama, rent a car',
                    'en' => 'car rental, rent a car, auto rental'
                ],
                'is_active' => true,
                'is_system' => false,
            ],
            [
                'route_group_name' => 'locations',
                'title' => [
                    'tr' => 'Ofislerimiz',
                    'en' => 'Locations'
                ],
                'meta_title' => [
                    'tr' => 'Teslimat Noktaları ve Ofislerimiz',
                    'en' => 'Pick-up Locations and Offices'
                ],
                'meta_description' => [
                    'tr' => 'Araç kiralama ofislerimiz ve havalimanı teslimat noktalarımız.',
                    'en' => 'Our car rental offices and airport pick-up locations.'
                ],
                'meta_keywords' => [
                    'tr' => 'havalimanı araç kiralama, teslimat noktaları',
                    'en' => 'airport car rental, pick-up locations'
                ],
                'is_active' => true,
                'is_system' => false,
            ],
            [
                'route_group_name' => 'about',
                'title' => [
                    'tr' => 'Hakkımızda',
                    'en' => 'About Us'
                ],
                'meta_title' => [
                    'tr' => 'Biz Kimiz? | Kurumsal',
                    'en' => 'Who Are We? | Corporate'
                ],
                'meta_description' => [
                    'tr' => 'Yılların tecrübesiyle güvenilir araç kiralama hizmeti sunuyoruz.',
                    'en' => 'We offer reliable car rental services with years of experience.'
                ],
                'meta_keywords' => [
                    'tr' => 'kurumsal araç kiralama, hakkımızda',
                    'en' => 'corporate car rental, about us'
                ],
                'is_active' => true,
                'is_system' => false,
            ],
            [
                'route_group_name' => 'blog',
                'title' => [
                    'tr' => 'Blog',
                    'en' => 'Blog'
                ],
                'meta_title' => [
                    'tr' => 'Araç Kiralama Rehberi ve Haberler',
                    'en' => 'Car Rental Guide and News'
                ],
                'meta_description' => [
                    'tr' => 'Araç kiralama ipuçları, seyahat rehberleri ve güncel haberler.',
                    'en' => 'Car rental tips, travel guides, and latest news.'
                ],
                'meta_keywords' => [
                    'tr' => 'seyahat rehberi, araç kiralama ipuçları',
                    'en' => 'travel guide, car rental tips'
                ],
                'is_active' => true,
                'is_system' => false,
            ],
            [
                'route_group_name' => 'campaigns',
                'title' => [
                    'tr' => 'Kampanyalar',
                    'en' => 'Campaigns'
                ],
                'meta_title' => [
                    'tr' => 'Araç Kiralama Kampanyaları ve İndirimler',
                    'en' => 'Car Rental Campaigns and Discounts'
                ],
                'meta_description' => [
                    'tr' => 'En güncel araç kiralama kampanyaları, indirim kodları ve fırsatları kaçırmayın.',
                    'en' => 'Do not miss the latest car rental campaigns, discount codes, and special offers.'
                ],
                'meta_keywords' => [
                    'tr' => 'araç kiralama kampanyaları, indirimli araç, rent a car fırsatları',
                    'en' => 'car rental campaigns, discounted cars, rent a car deals'
                ],
                'is_active' => true,
                'is_system' => false,
            ],
            [
                'route_group_name' => 'corporate',
                'title' => [
                    'tr' => 'Kurumsal Kiralama',
                    'en' => 'Corporate Rental'
                ],
                'meta_title' => [
                    'tr' => 'Şirketler İçin Kurumsal Araç Kiralama',
                    'en' => 'Corporate Car Rental for Companies'
                ],
                'meta_description' => [
                    'tr' => 'Şirketinize özel avantajlı fiyatlarla uzun dönem veya kurumsal araç kiralama çözümleri.',
                    'en' => 'Long-term or corporate car rental solutions with advantageous prices for your company.'
                ],
                'meta_keywords' => [
                    'tr' => 'kurumsal araç kiralama, şirket aracı kiralama, filo kiralama, uzun dönem kiralama',
                    'en' => 'corporate car rental, company car rental, fleet rental, long term rental'
                ],
                'is_active' => true,
                'is_system' => false,
            ]
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['route_group_name' => $page['route_group_name']],
                $page
            );
        }
    }
}
