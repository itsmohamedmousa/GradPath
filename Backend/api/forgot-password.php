<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit();
}

try {
    // Check if email exists in database
    $stmt = $pdo->prepare("SELECT id, username, email FROM User WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => true,
            'message' => 'If an account exists with this email, you will receive a password reset link shortly.'
        ]);
        exit();
    }

    $secret_key = $_ENV['JWT_SECRET_KEY'];
    $issued_at = time();
    $expiration_time = time() + $_ENV['JWT_EXPIRES_IN'];

    $payload = [
        'email' => $email,
        'user_id' => $user['id'],
        'iat' => $issued_at,
        'exp' => $expiration_time
    ];

    function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    $header_encoded = base64url_encode($header);
    $payload_encoded = base64url_encode(json_encode($payload));

    $signature = hash_hmac(
        'sha256',
        "$header_encoded.$payload_encoded",
        $secret_key,
        true
    );

    $signature_encoded = base64url_encode($signature);

    $token = "$header_encoded.$payload_encoded.$signature_encoded";

    // Send email using PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_ADDRESS'];
        $mail->Password = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['MAIL_PORT'];

        // Recipients
        $mail->setFrom($_ENV['MAIL_ADDRESS'], $_ENV['MAIL_NAME']);
        $mail->addAddress($email, $user['username']);

        // Content
        $resetLink = $_ENV['FRONTEND_URL'] . "/reset-password?token=" . urlencode($token);

        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request';
        $mail->Body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .button { 
                        display: inline-block; 
                        padding: 12px 24px; 
                        background-color: #2563eb; 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        margin: 20px 0;
                    }
                    .footer { margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Password Reset Request</h2>
                    <p>Hello {$user['username']},</p>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <a href='{$resetLink}' class='button'>Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style='word-break: break-all; font-size: 12px;'>{$resetLink}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                    <div class='footer'>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        ";
        $mail->AltBody = "Hello {$user['username']},\n\nWe received a request to reset your password.\n\nClick this link to reset it: {$resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.";

        $mail->send();

        echo json_encode([
            'success' => true,
            'message' => 'Password reset link has been sent to your email'
        ]);

    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send email. Please try again later.'
        ]);
    }

} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}
?>