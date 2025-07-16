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
  $stmt = $pdo->prepare("SELECT user_id, current_gpa, cumulative_gpa, completed_credits FROM GPA WHERE user_id = ?");
  $stmt->execute([$userId]);
  $gpa = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit;
}

if (!$gpa) {
  http_response_code(404);
  echo json_encode(['error' => 'User: ' . $userId]);
  echo json_encode(['error' => 'GPA not found']);
  exit;
}

header('Content-Type: application/json');
echo json_encode(['gpa' => $gpa]);
?>