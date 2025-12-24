<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../auth_utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

$user = requireAuth();
$userId = $user->userId;

$input = json_decode(file_get_contents('php://input'), true);
$currentPassword = $input['currentPassword'] ?? '';
$newPassword = $input['newPassword'] ?? '';

if (empty($currentPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Current and new passwords are required'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT password FROM User WHERE id = ?");
    $stmt->execute([$userId]);
    $userRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userRecord) {
        throw new Exception('User not found');
    }

    if (!password_verify($currentPassword, $userRecord['password'])) {
        throw new Exception('Current password is incorrect');
    }

    $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE User SET password = ? WHERE id = ?");
    $stmt->execute([$newHashedPassword, $userId]);

    echo json_encode([
        'success' => true,
        'message' => 'Password updated successfully'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
