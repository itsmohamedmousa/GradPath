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
        $mail->setFrom($_ENV['MAIL_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($email, $user['username']);

        // Content
        $resetLink = $_ENV['FRONTEND_URL'] . "/reset-password?token=" . urlencode($token);

        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request - GradPath';
        $mail->Body = "
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                
                <div style='background-color: #007bff; padding: 25px; text-align: center;'>
                    <h2 style='color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;'>Security Notification</h2>
                </div>
                
                <div style='padding: 30px; background-color: #ffffff;'>
                    <p style='font-size: 16px; color: #555;'>Hello <strong>{$user['username']}</strong>,</p>
                    <p style='font-size: 16px; color: #555;'>We received a request to reset your password for your account. Click the button below to proceed:</p>
                    
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{$resetLink}' 
                        style='background-color: #007bff; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                        Reset Password
                        </a>
                    </div>
                    
                    <div style='background-color: #fff9e6; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;'>
                        <p style='margin: 0; font-size: 14px; color: #856404;'>
                            <strong>Security Notice:</strong> This link will expire in 1 hour. If you did not request this, please ignore this email; your account remains secure.
                        </p>
                    </div>
                    
                    <p style='margin-top: 25px; font-size: 13px; color: #888;'>
                        If the button above doesn't work, copy and paste this link into your browser:
                        <br>
                        <span style='color: #007bff; word-break: break-all;'>{$resetLink}</span>
                    </p>
                </div>
                
                <div style='background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;'>
                    <p style='margin: 0 0 10px 0;'>This is an automated message, please do not reply.</p>
                    <p style='margin: 0;'>&copy; " . date('Y') . " " . $_ENV['MAIL_FROM_NAME'] . ". All rights reserved.</p>
                </div>
            </div>
        ";

        $mail->AltBody = "Hello {$user['username']},\n\nWe received a request to reset your password. Use the link below to reset it:\n\n{$resetLink}\n\nThis link will expire in 1 hour.\n\n© " . date('Y') . " " . $_ENV['MAIL_FROM_NAME'];

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