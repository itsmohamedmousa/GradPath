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
  $stmt = $pdo->prepare("SELECT user_id, title, content, subject, created_at, updated_at FROM Notes WHERE user_id = ?");
  $stmt->execute([$userId]);
  $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit;
}

header('Content-Type: application/json');
echo json_encode(['notes' => $notes]);
?>