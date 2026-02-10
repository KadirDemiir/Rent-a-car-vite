<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Password Reset
        EmailTemplate::firstOrCreate(
            ['name' => 'password_reset'],
            [
                'subject' => json_encode([
                    'en' => 'Reset Your Password',
                    'tr' => 'Şifrenizi Sıfırlayın'
                ], JSON_UNESCAPED_UNICODE),
                'body' => json_encode([
                    'en' => '<h1>Hello {{user_name}}</h1><p>You are receiving this email because we received a password reset request for your account.</p><p>Click the link below to reset your password:</p><p><a href="{{reset_link}}">Reset Password</a></p><p>If you did not request a password reset, no further action is required.</p><p>This password reset link will expire in 60 minutes.</p><p>Thank you,<br>The Team</p>',
                    'tr' => '<h1>Merhaba {{user_name}}</h1><p>Hesabınız için bir şifre sıfırlama talebi aldık.</p><p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p><p><a href="{{reset_link}}">Şifreyi Sıfırla</a></p><p>Eğer bu talebi siz yapmadıysanız, herhangi bir işlem yapmanıza gerek yoktur.</p><p>Bu şifre sıfırlama bağlantısının süresi 60 dakika içinde dolacaktır.</p><p>Teşekkürler,<br>Ekip</p>'
                ], JSON_UNESCAPED_UNICODE),
                'variables' => ['user_name', 'reset_link'],
                'is_active' => true,
            ]
        );

        // 2. Reservation Created (YENİ EKLENEN)
        EmailTemplate::firstOrCreate(
            ['name' => 'reservation_created'],
            [
                'subject' => json_encode([
                    'en' => 'Reservation Confirmed - {{reference_code}}',
                    'tr' => 'Rezervasyon Onayı - {{reference_code}}'
                ], JSON_UNESCAPED_UNICODE),
                'body' => json_encode([
                    'en' => '<h1>Reservation Successful</h1><p>Dear {{user_name}},</p><p>Your reservation has been successfully created.</p><p><strong>Reservation Details:</strong></p><ul><li>Reference Code: <strong>{{reference_code}}</strong></li><li>Vehicle: {{car_name}}</li><li>Pickup: {{pickup_location}} - {{pickup_date}}</li><li>Return: {{return_location}} - {{return_date}}</li><li><strong>Total Price: {{total_price}}</strong></li></ul><p>You can track or modify your reservation using the link below:</p><p><a href="{{tracking_url}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Reservation</a></p><p>Thank you for choosing us.</p>',
                    'tr' => '<h1>Rezervasyon Başarılı</h1><p>Sayın {{user_name}},</p><p>Rezervasyonunuz başarıyla oluşturulmuştur.</p><p><strong>Rezervasyon Detayları:</strong></p><ul><li>Referans Kodu: <strong>{{reference_code}}</strong></li><li>Araç: {{car_name}}</li><li>Alış: {{pickup_location}} - {{pickup_date}}</li><li>İade: {{return_location}} - {{return_date}}</li><li><strong>Toplam Tutar: {{total_price}}</strong></li></ul><p>Rezervasyonunuzu aşağıdaki bağlantıdan takip edebilir veya düzenleyebilirsiniz:</p><p><a href="{{tracking_url}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rezervasyonu Takip Et</a></p><p>Bizi tercih ettiğiniz için teşekkürler.</p>'
                ], JSON_UNESCAPED_UNICODE),
                'variables' => [
                    'user_name',
                    'reference_code',
                    'car_name',
                    'tracking_url',
                    'pickup_location',
                    'return_location',
                    'pickup_date',
                    'return_date',
                    'total_price'
                ],
                'is_active' => true,
            ]
        );

        // 3. Welcome Email
        EmailTemplate::firstOrCreate(
            ['name' => 'welcome_email'],
            [
                'subject' => json_encode([
                    'en' => 'Welcome to Our Service!',
                    'tr' => 'Hizmetimize Hoşgeldiniz!'
                ], JSON_UNESCAPED_UNICODE),
                'body' => json_encode([
                    'en' => '<h1>Welcome {{user_name}}!</h1><p>Thank you for registering with us. We are excited to have you on board.</p><p>You can now browse our cars and make reservations.</p><p>Best regards,<br>The Team</p>',
                    'tr' => '<h1>Hoşgeldin {{user_name}}!</h1><p>Kayıt olduğunuz için teşekkür ederiz. Sizi aramızda görmekten mutluluk duyuyoruz.</p><p>Artık araçlarımıza göz atabilir ve rezervasyon yapabilirsiniz.</p><p>Saygılarımızla,<br>Ekip</p>'
                ], JSON_UNESCAPED_UNICODE),
                'variables' => ['user_name'],
                'is_active' => true,
            ]
        );

        // 4. Reservation Approved
        EmailTemplate::firstOrCreate(
            ['name' => 'reservation_approved'],
            [
                'subject' => json_encode([
                    'en' => 'Reservation Approved - {{reservation_id}}',
                    'tr' => 'Rezervasyonunuz Onaylandı - {{reservation_id}}'
                ], JSON_UNESCAPED_UNICODE),
                'body' => json_encode([
                    'en' => '<h1>Reservation Approved</h1><p>Dear {{user_name}},</p><p>Good news! Your reservation #{{reservation_id}} has been approved.</p><p>Your vehicle {{car_name}} will be ready for pickup at {{pickup_location}} on {{pickup_date}}.</p><p>We look forward to seeing you!</p>',
                    'tr' => '<h1>Rezervasyon Onaylandı</h1><p>Sayın {{user_name}},</p><p>Güzel haber! #{{reservation_id}} numaralı rezervasyonunuz onaylanmıştır.</p><p>{{car_name}} aracınız, {{pickup_date}} tarihinde {{pickup_location}} konumunda teslimata hazır olacaktır.</p><p>Sizi görmekten mutluluk duyacağız!</p>'
                ], JSON_UNESCAPED_UNICODE),
                'variables' => ['user_name', 'reservation_id', 'car_name', 'pickup_date', 'pickup_location'],
                'is_active' => true,
            ]
        );

        // 5. Reservation Rejected
        EmailTemplate::firstOrCreate(
            ['name' => 'reservation_rejected'],
            [
                'subject' => json_encode([
                    'en' => 'Update Regarding Reservation - {{reservation_id}}',
                    'tr' => 'Rezervasyon Durumu Hakkında - {{reservation_id}}'
                ], JSON_UNESCAPED_UNICODE),
                'body' => json_encode([
                    'en' => '<h1>Reservation Status Update</h1><p>Dear {{user_name}},</p><p>We regret to inform you that we could not approve your reservation #{{reservation_id}}.</p><p><strong>Reason:</strong> {{rejection_reason}}</p><p>Please contact our support team for further assistance or try booking a different vehicle.</p><p>Regards,<br>The Team</p>',
                    'tr' => '<h1>Rezervasyon Durum Güncellemesi</h1><p>Sayın {{user_name}},</p><p>Üzülerek bildiririz ki #{{reservation_id}} numaralı rezervasyonunuzu onaylayamadık.</p><p><strong>Sebep:</strong> {{rejection_reason}}</p><p>Destek için lütfen ekibimizle iletişime geçin veya farklı bir araç kiralamayı deneyin.</p><p>Saygılarımızla,<br>Ekip</p>'
                ], JSON_UNESCAPED_UNICODE),
                'variables' => ['user_name', 'reservation_id', 'rejection_reason'],
                'is_active' => true,
            ]
        );
    }
}
