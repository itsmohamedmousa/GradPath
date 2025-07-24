<?php
require __DIR__ . '/vendor/autoload.php';
require_once '../config/database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyToken($token)
{
  try {
    $secretKey = $_ENV['JWT_SECRET'];
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    return $decoded;
  } catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
    return false;
  }
}

function requireAuth()
{
  $headers = getallheaders();

  if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'] ?? '', $matches)) {
    $token = $matches[1];
    $decoded = verifyToken($token);

    if (!$decoded) {
      http_response_code(401); // Unauthorized
      echo json_encode(['error' => 'Invalid or expired token ']);
      exit;
    }

    return $decoded;
  } else {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Missing token']);
    exit;
  }
}