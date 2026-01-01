<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';

function base64url_decode($data)
{
    return base64_decode(strtr($data, '-_', '+/'));
}


if (empty($token)) {
    echo json_encode([
        'success' => false,
        'message' => 'Token is required'
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
            'message' => 'Invalid token signature'
        ]);
        exit();
    }

    // Decode payload
    $payload = json_decode(base64url_decode($payload_encoded), true);

    if (!$payload) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token payload'
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

    echo json_encode([
        'success' => true,
        'message' => 'Token is valid'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Token validation failed'
    ]);
}
?>