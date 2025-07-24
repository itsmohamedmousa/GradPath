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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$sessionId = $input['sessionId'] ?? null;

try {
    // Decode JWT token to get user ID
    $secretKey = $_ENV['JWT_SECRET'];
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    $userId = $decoded->userId;

    // Delete the specific session if sessionId is provided
    if ($sessionId) {
        $stmt = $pdo->prepare("DELETE FROM Session WHERE id = ? AND user_id = ?");
        $stmt->execute([$sessionId, $userId]);
    } else {
        // Delete all sessions for this user
        $stmt = $pdo->prepare("DELETE FROM Session WHERE user_id = ?");
        $stmt->execute([$userId]);
    }

    // Also delete the session with this specific token
    $stmt = $pdo->prepare("DELETE FROM Session WHERE jwt_token = ?");
    $stmt->execute([$token]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);

} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    
    // Even if there's an error, we still want to allow logout
    // Try to delete by token only
    try {
        $stmt = $pdo->prepare("DELETE FROM Session WHERE jwt_token = ?");
        $stmt->execute([$token]);
    } catch (Exception $e2) {
        error_log("Logout cleanup error: " . $e2->getMessage());
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}
?>