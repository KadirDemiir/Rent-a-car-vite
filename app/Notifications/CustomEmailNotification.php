<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomEmailNotification extends Notification
{
    use Queueable;

    protected $templateName;
    protected $data;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $templateName, array $data = [])
    {
        $this->templateName = $templateName;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
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

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
