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
$totalCredits = isset($input['totalCredits']) && $input['totalCredits'] !== '' ? (int) $input['totalCredits'] : null;
$completedCredits = isset($input['completedCredits']) && $input['completedCredits'] !== '' ? (int) $input['completedCredits'] : null;
$cumulativeGpa = isset($input['cumulativeGpa']) && $input['cumulativeGpa'] !== '' ? (float) $input['cumulativeGpa'] : null;

// Basic validation
if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Username, email, and password are required'
    ]);
    exit;
}

// Validate required academic fields
if ($totalCredits === null || $completedCredits === null || $cumulativeGpa === null) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Total credits, completed credits, and cumulative GPA are required'
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

// Validate academic data
if ($totalCredits < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Total credits must be a positive number'
    ]);
    exit;
}

if ($completedCredits < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Completed credits must be a positive number'
    ]);
    exit;
}

if ($cumulativeGpa < 0 || $cumulativeGpa > 4) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Cumulative GPA must be between 0 and 4'
    ]);
    exit;
}

if ($completedCredits > $totalCredits) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Completed credits cannot exceed total credits'
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

    // Start transaction
    $pdo->beginTransaction();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    // Insert new user with total_credits
    $stmt = $pdo->prepare("
        INSERT INTO User (username, email, password, university, major, total_credits) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$username, $email, $hashedPassword, $university, $major, $totalCredits]);
    $userId = $pdo->lastInsertId();

    // Create JWT token using environment variable
    $secretKey = $_ENV['JWT_SECRET'];
    $expirationTime = time() + (int) $_ENV['JWT_EXPIRES_IN']; // 24 hours from .env

    $payload = [
        'userId' => (int) $userId,
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

    // Initialize GPA record for new user with provided values
    $stmt = $pdo->prepare("
        INSERT INTO GPA (user_id, cumulative_gpa, completed_credits) 
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$userId, $cumulativeGpa, $completedCredits]);

    // Commit transaction
    $pdo->commit();

    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'User registered successfully',
        'data' => [
            'token' => $token,
            'user' => [
                'id' => (int) $userId,
                'username' => $username,
                'email' => $email,
                'university' => $university,
                'major' => $major,
                'total_credits' => $totalCredits,
                'completed_credits' => $completedCredits,
                'cumulative_gpa' => $cumulativeGpa
            ]
        ]
    ]);

} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please try again.'
    ]);
} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("General error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred.'
    ]);
}
?>