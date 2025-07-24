<?php
require_once '../config/database.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get Authorization header
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided']);
    exit;
}

// Extract token
$token = substr($authHeader, 7);

try {
    // Decode JWT token
    $secretKey = $_ENV['JWT_SECRET'];
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    
    // Check if session exists and is valid
    $stmt = $pdo->prepare("
        SELECT s.id, s.expires_at, u.id as user_id, u.username, u.email, u.university, u.major
        FROM Session s 
        JOIN User u ON s.user_id = u.id 
        WHERE s.jwt_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$token]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit;
    }

    // Token is valid
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Token is valid',
        'data' => [
            'user' => [
                'id' => (int)$session['user_id'],
                'username' => $session['username'],
                'email' => $session['email'],
                'university' => $session['university'],
                'major' => $session['major']
            ]
        ]
    ]);

} catch (Exception $e) {
    error_log("Token validation error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
}
?>