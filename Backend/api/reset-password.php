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

function base64url_decode($data)
{
    return base64_decode(strtr($data, '-_', '+/'));
}


$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';
$password = $data['password'] ?? '';

if (empty($token) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Token and password are required'
    ]);
    exit();
}

// Validate password length
if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 6 characters long'
    ]);
    exit();
}

// Decode and verify JWT token
$secret_key = $_ENV['JWT_SECRET_KEY'];

try {
    // Split token into parts
    $tokenParts = explode('.', $token);

    if (count($tokenParts) !== 3) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token format'
        ]);
        exit();
    }

    list($header_encoded, $payload_encoded, $signature_encoded) = $tokenParts;

    // Verify signature
    $signature = base64url_decode($signature_encoded);
    $expected_signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", $secret_key, true);

    if (!hash_equals($signature, $expected_signature)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token'
        ]);
        exit();
    }

    // Decode payload
    $payload = json_decode(base64url_decode($payload_encoded), true);

    if (!$payload) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token'
        ]);
        exit();
    }

    // Check expiration
    if (!isset($payload['exp']) || $payload['exp'] < time()) {
        echo json_encode([
            'success' => false,
            'message' => 'Token has expired'
        ]);
        exit();
    }

    // Check required fields
    if (!isset($payload['email']) || !isset($payload['user_id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token data'
        ]);
        exit();
    }

    // Verify user still exists
    $stmt = $pdo->prepare("SELECT id FROM User WHERE id = ? AND email = ?");
    $stmt->execute([$payload['user_id'], $payload['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit();
    }

    // Hash the new password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Update password in database
    $stmt = $pdo->prepare("UPDATE User SET password = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $payload['user_id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Password has been reset successfully'
    ]);

} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to reset password. Please try again.'
    ]);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again.'
    ]);
}
?>