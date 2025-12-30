<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

function sendReminderEmail($to, $title, $eventTime, $description) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = '522499hm@gmail.com';
        $mail->Password   = 'ibxd mjkw qbgw dyql';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('522499hm@gmail.com', 'GradPath Reminders');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = "⏰ Reminder: $title";

        $mail->Body = "
            <h3>Upcoming Event Reminder</h3>
            <p><strong>Title:</strong> $title</p>
            <p><strong>Time:</strong> $eventTime</p>
            <p><strong>Description:</strong><br>$description</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo . PHP_EOL;
        return false;
    }
}
