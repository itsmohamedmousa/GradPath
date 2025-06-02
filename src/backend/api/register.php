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
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$university = trim($input['university'] ?? '') ?: null;
$major = trim($input['major'] ?? '') ?: null;

// Basic validation
if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Username, email, and password are required'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Validate password length
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Password must be at least 6 characters long'
    ]);
    exit;
}

try {
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM User WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Username or email already exists'
        ]);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO User (username, email, password, university, major) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$username, $email, $hashedPassword, $university, $major]);
    $userId = $pdo->lastInsertId();

    // Create JWT token using environment variable
    $secretKey = $_ENV['JWT_SECRET'];
    $expirationTime = time() + (int)$_ENV['JWT_EXPIRES_IN']; // 24 hours from .env
    
    $payload = [
        'userId' => (int)$userId,
        'username' => $username,
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
    $stmt->execute([$userId, $token, $expiresAt]);

    // Initialize GPA record for new user
    $stmt = $pdo->prepare("
        INSERT INTO GPA (user_id, current_gpa, cumulative_gpa, completed_credits) 
        VALUES (?, 0.0, 0.0, 0)
    ");
    $stmt->execute([$userId]);

    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'User registered successfully',
        'data' => [
            'token' => $token,
            'user' => [
                'id' => (int)$userId,
                'username' => $username,
                'email' => $email,
                'university' => $university,
                'major' => $major,
                'total_credits' => 0
            ]
        ]
    ]);

} catch(PDOException $e) {
    error_log("Database error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Registration failed. Please try again.'
    ]);
} catch(Exception $e) {
    error_log("General error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred.'
    ]);
}
?>