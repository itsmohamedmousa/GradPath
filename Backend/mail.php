<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

function sendReminderEmail($to, $title, $eventTime, $description)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_ADDRESS'];
        $mail->Password = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom($_ENV['MAIL_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = "Reminder: $title";

        $mail->Body = "
            <div style='background-color: #f9fafb; padding: 40px 10px; font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>
                    
                    <div style='background-color: #007bff; padding: 25px; text-align: center;'>
                        <h2 style='color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;'>Event Reminder</h2>
                    </div>
                    
                    <div style='padding: 30px;'>
                        <p style='font-size: 16px; color: #4b5563;'>Hello,</p>
                        <p style='font-size: 16px; color: #4b5563;'>This is a friendly reminder for your upcoming event:</p>
                        
                        <table style='width: 100%; border-collapse: collapse; margin: 25px 0;'>
                            <tr>
                                <td style='padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #111827; width: 35%;'>Event Title:</td>
                                <td style='padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563;'>$title</td>
                            </tr>
                            <tr>
                                <td style='padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #111827;'>Scheduled Time:</td>
                                <td style='padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563;'>$eventTime</td>
                            </tr>
                        </table>
                        
                        <div style='background-color: #f8fafc; padding: 20px; border-left: 4px solid #007bff; border-radius: 4px;'>
                            <p style='margin: 0 0 8px 0; font-weight: bold; color: #1e293b; font-size: 14px;'>Description:</p>
                            <p style='margin: 0; color: #64748b; font-size: 15px; line-height: 1.5;'>$description</p>
                        </div>
                        
                        <p style='margin-top: 30px; font-size: 14px; color: #9ca3af; text-align: center;'>
                            This is an automated message, please do not reply.
                        </p>
                    </div>
                    
                    <div style='background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;'>
                        <p style='margin: 0 0 5px 0;'>&copy; " . date('Y') . " " . $_ENV['MAIL_FROM_NAME'] . ". All rights reserved.</p>
                        <p style='display:none; font-size:1px; color:#f3f4f6;'>Ref: " . bin2hex(random_bytes(4)) . "</p>
                    </div>
                </div>
            </div>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo . PHP_EOL;
        return false;
    }
}
