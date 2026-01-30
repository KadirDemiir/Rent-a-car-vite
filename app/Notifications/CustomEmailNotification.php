<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomEmailNotification extends Notification
{
    use Queueable;

    protected $templateName;
    protected $data;

    public function __construct(string $templateName, array $data = [])
    {
        $this->templateName = $templateName;
        $this->data = $data;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->data['tracking_url'] = $notifiable->tracking_url;

        $template = EmailTemplate::where('name', $this->templateName)
            ->where('is_active', true)
            ->first();

        if (!$template) {
            throw new \Exception("Email template '{$this->templateName}' not found or inactive");
        }

        $rendered = $template->render($this->data);

        return (new MailMessage)
            ->subject($rendered['subject'])
            ->view('emails.generic', ['body' => $rendered['body']]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}