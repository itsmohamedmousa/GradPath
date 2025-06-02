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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input data
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Basic validation
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Username and password are required'
    ]);
    exit;
}

try {
    // Find user by username or email
    $stmt = $pdo->prepare("
        SELECT id, username, email, password, university, major 
        FROM User 
        WHERE username = ? OR email = ?
    ");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists and password is correct
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid username or password'
        ]);
        exit;
    }


    // Create JWT token using environment variable
    $secretKey = $_ENV['JWT_SECRET'];
    $expirationTime = time() + (int)$_ENV['JWT_EXPIRES_IN']; // 24 hours from .env
    
    $payload = [
        'userId' => (int)$user['id'],
        'username' => $user['username'],
        'iat' => time(),
        'exp' => $expirationTime
    ];
    
    $token = JWT::encode($payload, $secretKey, 'HS256');

    // Store session in database
    $expiresAt = date('Y-m-d H:i:s', $expirationTime);
    $stmt = $pdo->prepare("
        INSERT INTO Session (user_id, jwt_token, expires_at) 
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$user['id'], $token, $expiresAt]);
    $sessionId = $pdo->lastInsertId();

    // Clean up expired sessions for this user (optional housekeeping)
    $stmt = $pdo->prepare("DELETE FROM Session WHERE user_id = ? AND expires_at < NOW()");
    $stmt->execute([$user['id']]);

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'sessionId' => (int)$sessionId,
            'user' => [
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'university' => $user['university'],
                'major' => $user['major']
                // 'total_credits' => (int)$totalCredits
            ]
        ]
    ]);

} catch(PDOException $e) {
    error_log("Database error in login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Login failed. Please try again.'
    ]);
} catch(Exception $e) {
    error_log("General error in login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred.'
    ]);
}
?>