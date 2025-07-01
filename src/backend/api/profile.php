<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../auth_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$user = requireAuth();
$userId = $user->userId;

try {
  $stmt = $pdo->prepare("SELECT id, username, email, profile_pic, university, major, total_credits, created_at FROM User WHERE id = ?");
  $stmt->execute([$userId]);
  $profile = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit;
}

if (!$profile) {
  http_response_code(404);
  echo json_encode(['error' => 'User: ' . $userId]);
  echo json_encode(['error' => 'User not found']);
  exit;
}

header('Content-Type: application/json');
echo json_encode(['profile' => $profile]);
?>