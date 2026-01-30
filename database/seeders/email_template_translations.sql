-- SQL queries to manually add email template translations
-- Run these queries in order

-- First, insert the translation keys
INSERT INTO translation_keys (`key`, description, created_at, updated_at) VALUES
('adminpanel.email.edit_email_template', 'Edit Email Template', NOW(), NOW()),
('adminpanel.email.back', 'Back', NOW(), NOW()),
('adminpanel.email.template_name', 'Template Name', NOW(), NOW()),
('adminpanel.email.template_name_placeholder', 'e.g., password_reset', NOW(), NOW()),
('adminpanel.email.subject', 'Subject', NOW(), NOW()),
('adminpanel.email.email_subject_placeholder', 'Email subject (use {{variables}} for dynamic content)', NOW(), NOW()),
('adminpanel.email.email_subject_input', 'Email subject', NOW(), NOW()),
('adminpanel.email.body', 'Body', NOW(), NOW()),
('adminpanel.email.email_body_placeholder', 'Use {{variable}} placeholders for dynamic content.', NOW(), NOW()),
('adminpanel.email.update_template', 'Update Template', NOW(), NOW()),
('adminpanel.email.cancel', 'Cancel', NOW(), NOW()),
('adminpanel.email.email_templates', 'Email Templates', NOW(), NOW()),
('adminpanel.email.add_template', 'Add Template', NOW(), NOW()),
('adminpanel.email.search_templates', 'Search templates...', NOW(), NOW()),
('adminpanel.email.name', 'Name', NOW(), NOW()),
('adminpanel.email.status', 'Status', NOW(), NOW()),
('adminpanel.email.actions', 'Actions', NOW(), NOW()),
('adminpanel.email.active', 'Active', NOW(), NOW()),
('adminpanel.email.inactive', 'Inactive', NOW(), NOW()),
('adminpanel.email.edit', 'Edit', NOW(), NOW()),
('adminpanel.email.delete', 'Delete', NOW(), NOW()),
('adminpanel.email.add_email_template', 'Add Email Template', NOW(), NOW()),
('adminpanel.email.create_template', 'Create Template', NOW(), NOW()),
('adminpanel.email.fill_all_languages', 'Please fill subject and body for all languages.', NOW(), NOW()),
('adminpanel.email.failed_create_template', 'Failed to create template', NOW(), NOW()),
('adminpanel.email.confirm_delete_template', 'Are you sure you want to delete this template?', NOW(), NOW()),
('adminpanel.email.failed_delete_template', 'Failed to delete template', NOW(), NOW());

-- Then, insert English translations (assuming language_id = 1 for English)
-- Get the translation_key_id from the previous inserts
INSERT INTO translations (language_id, translation_key_id, value, created_at, updated_at)
SELECT 1, id, 
    CASE 
        WHEN `key` = 'adminpanel.email.edit_email_template' THEN 'Edit Email Template'
        WHEN `key` = 'adminpanel.email.back' THEN 'Back'
        WHEN `key` = 'adminpanel.email.template_name' THEN 'Template Name'
        WHEN `key` = 'adminpanel.email.template_name_placeholder' THEN 'e.g., password_reset'
        WHEN `key` = 'adminpanel.email.subject' THEN 'Subject'
        WHEN `key` = 'adminpanel.email.email_subject_placeholder' THEN 'Email subject (use {{variables}} for dynamic content)'
        WHEN `key` = 'adminpanel.email.email_subject_input' THEN 'Email subject'
        WHEN `key` = 'adminpanel.email.body' THEN 'Body'
        WHEN `key` = 'adminpanel.email.email_body_placeholder' THEN 'Use {{variable}} placeholders for dynamic content.'
        WHEN `key` = 'adminpanel.email.update_template' THEN 'Update Template'
        WHEN `key` = 'adminpanel.email.cancel' THEN 'Cancel'
        WHEN `key` = 'adminpanel.email.email_templates' THEN 'Email Templates'
        WHEN `key` = 'adminpanel.email.add_template' THEN 'Add Template'
        WHEN `key` = 'adminpanel.email.search_templates' THEN 'Search templates...'
        WHEN `key` = 'adminpanel.email.name' THEN 'Name'
        WHEN `key` = 'adminpanel.email.status' THEN 'Status'
        WHEN `key` = 'adminpanel.email.actions' THEN 'Actions'
        WHEN `key` = 'adminpanel.email.active' THEN 'Active'
        WHEN `key` = 'adminpanel.email.inactive' THEN 'Inactive'
        WHEN `key` = 'adminpanel.email.edit' THEN 'Edit'
        WHEN `key` = 'adminpanel.email.delete' THEN 'Delete'
        WHEN `key` = 'adminpanel.email.add_email_template' THEN 'Add Email Template'
        WHEN `key` = 'adminpanel.email.create_template' THEN 'Create Template'
        WHEN `key` = 'adminpanel.email.fill_all_languages' THEN 'Please fill subject and body for all languages.'
        WHEN `key` = 'adminpanel.email.failed_create_template' THEN 'Failed to create template'
        WHEN `key` = 'adminpanel.email.confirm_delete_template' THEN 'Are you sure you want to delete this template?'
        WHEN `key` = 'adminpanel.email.failed_delete_template' THEN 'Failed to delete template'
    END,
    NOW(), NOW()
FROM translation_keys
WHERE `key` IN (
    'adminpanel.email.edit_email_template', 'adminpanel.email.back', 'adminpanel.email.template_name', 'adminpanel.email.template_name_placeholder',
    'adminpanel.email.subject', 'adminpanel.email.email_subject_placeholder', 'adminpanel.email.email_subject_input', 'adminpanel.email.body',
    'adminpanel.email.email_body_placeholder', 'adminpanel.email.update_template', 'adminpanel.email.cancel', 'adminpanel.email.email_templates',
    'adminpanel.email.add_template', 'adminpanel.email.search_templates', 'adminpanel.email.name', 'adminpanel.email.status', 'adminpanel.email.actions',
    'adminpanel.email.active', 'adminpanel.email.inactive', 'adminpanel.email.edit', 'adminpanel.email.delete', 'adminpanel.email.add_email_template',
    'adminpanel.email.create_template', 'adminpanel.email.fill_all_languages', 'adminpanel.email.failed_create_template',
    'adminpanel.email.confirm_delete_template', 'adminpanel.email.failed_delete_template'
);

-- Then, insert Turkish translations (assuming language_id = 2 for Turkish)
INSERT INTO translations (language_id, translation_key_id, value, created_at, updated_at)
SELECT 2, id, 
    CASE 
        WHEN `key` = 'adminpanel.email.edit_email_template' THEN 'E-posta Şablonunu Düzenle'
        WHEN `key` = 'adminpanel.email.back' THEN 'Geri'
        WHEN `key` = 'adminpanel.email.template_name' THEN 'Şablon Adı'
        WHEN `key` = 'adminpanel.email.template_name_placeholder' THEN 'örn., password_reset'
        WHEN `key` = 'adminpanel.email.subject' THEN 'Konu'
        WHEN `key` = 'adminpanel.email.email_subject_placeholder' THEN 'E-posta konusu ({{değişkenler}} kullanabilirsiniz)'
        WHEN `key` = 'adminpanel.email.email_subject_input' THEN 'E-posta konusu'
        WHEN `key` = 'adminpanel.email.body' THEN 'İçerik'
        WHEN `key` = 'adminpanel.email.email_body_placeholder' THEN 'Dinamik içerik için {{değişken}} yer tutucuları kullanın.'
        WHEN `key` = 'adminpanel.email.update_template' THEN 'Şablonu Güncelle'
        WHEN `key` = 'adminpanel.email.cancel' THEN 'İptal'
        WHEN `key` = 'adminpanel.email.email_templates' THEN 'E-posta Şablonları'
        WHEN `key` = 'adminpanel.email.add_template' THEN 'Şablon Ekle'
        WHEN `key` = 'adminpanel.email.search_templates' THEN 'Şablon ara...'
        WHEN `key` = 'adminpanel.email.name' THEN 'Ad'
        WHEN `key` = 'adminpanel.email.status' THEN 'Durum'
        WHEN `key` = 'adminpanel.email.actions' THEN 'İşlemler'
        WHEN `key` = 'adminpanel.email.active' THEN 'Aktif'
        WHEN `key` = 'adminpanel.email.inactive' THEN 'Pasif'
        WHEN `key` = 'adminpanel.email.edit' THEN 'Düzenle'
        WHEN `key` = 'adminpanel.email.delete' THEN 'Sil'
        WHEN `key` = 'adminpanel.email.add_email_template' THEN 'E-posta Şablonu Ekle'
        WHEN `key` = 'adminpanel.email.create_template' THEN 'Şablon Oluştur'
        WHEN `key` = 'adminpanel.email.fill_all_languages' THEN 'Lütfen tüm diller için konu ve içerik doldurun.'
        WHEN `key` = 'adminpanel.email.failed_create_template' THEN 'Şablon oluşturulamadı'
        WHEN `key` = 'adminpanel.email.confirm_delete_template' THEN 'Bu şablonu silmek istediğinizden emin misiniz?'
        WHEN `key` = 'adminpanel.email.failed_delete_template' THEN 'Şablon silinemedi'
    END,
    NOW(), NOW()
FROM translation_keys
WHERE `key` IN (
    'adminpanel.email.edit_email_template', 'adminpanel.email.back', 'adminpanel.email.template_name', 'adminpanel.email.template_name_placeholder',
    'adminpanel.email.subject', 'adminpanel.email.email_subject_placeholder', 'adminpanel.email.email_subject_input', 'adminpanel.email.body',
    'adminpanel.email.email_body_placeholder', 'adminpanel.email.update_template', 'adminpanel.email.cancel', 'adminpanel.email.email_templates',
    'adminpanel.email.add_template', 'adminpanel.email.search_templates', 'adminpanel.email.name', 'adminpanel.email.status', 'adminpanel.email.actions',
    'adminpanel.email.active', 'adminpanel.email.inactive', 'adminpanel.email.edit', 'adminpanel.email.delete', 'adminpanel.email.add_email_template',
    'adminpanel.email.create_template', 'adminpanel.email.fill_all_languages', 'adminpanel.email.failed_create_template',
    'adminpanel.email.confirm_delete_template', 'adminpanel.email.failed_delete_template'
);

-- Note: If your language IDs are different, adjust the language_id values accordingly
-- You can check your language IDs with: SELECT id, code, name FROM languages;


