<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../auth_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Authenticate user
$user = requireAuth();
$userId = $user->userId;

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT id, username, email, profile_pic, university, major, total_credits, created_at FROM User WHERE id = ?");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$profile) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            exit;
        }

        echo json_encode(['success' => true, 'profile' => $profile]);
        exit;

    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        $username = trim($data['username'] ?? '');
        $email = trim($data['email'] ?? '');

        // Check for duplicate username
        $stmt = $pdo->prepare("SELECT id FROM User WHERE username = :username AND id != :id");
        $stmt->execute([':username' => $username, ':id' => $userId]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(409); // Conflict
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
            exit;
        }

        // Check for duplicate email
        $stmt = $pdo->prepare("SELECT id FROM User WHERE email = :email AND id != :id");
        $stmt->execute([':email' => $email, ':id' => $userId]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(409); // Conflict
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            exit;
        }

        // Update user
        $stmt = $pdo->prepare("
            UPDATE User SET
                username = :username,
                email = :email,
                profile_pic = :profile_pic,
                university = :university,
                major = :major,
                total_credits = :total_credits
            WHERE id = :id
        ");

        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':profile_pic' => $data['profile_pic'] ?? null,
            ':university' => $data['university'] ?? null,
            ':major' => $data['major'] ?? null,
            ':total_credits' => $data['total_credits'] ?? 0,
            ':id' => $userId
        ]);

        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        exit;

    } elseif ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM User WHERE id = ?");
        $stmt->execute([$userId]);

        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        exit;

    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}
