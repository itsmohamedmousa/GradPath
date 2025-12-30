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

// GET - Fetch all events for the user
if ($method === 'GET') {
  try {
    $stmt = $pdo->prepare("SELECT * FROM Calendar_Event WHERE user_id = ? ORDER BY event_time ASC");
    $stmt->execute([$userId]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['events' => $events]);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// POST - Create a new event
if ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['title']) || !isset($data['event_time'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Title and event_time are required']);
    exit;
  }

  try {
    $stmt = $pdo->prepare("
      INSERT INTO Calendar_Event (user_id, title, description, type, event_time, reminder_time) 
      VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
      $userId,
      $data['title'],
      $data['description'] ?? null,
      $data['type'] ?? 'event',
      $data['event_time'],
      $data['reminder_time'] ?? null
    ]);

    $eventId = $pdo->lastInsertId();

    // Fetch the created event
    $stmt = $pdo->prepare("SELECT * FROM Calendar_Event WHERE id = ?");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);
    echo json_encode(['event' => $event, 'message' => 'Event created successfully']);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// PUT - Update an existing event
if ($method === 'PUT') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Event ID is required']);
    exit;
  }

  try {
    // Check if event belongs to user
    $stmt = $pdo->prepare("SELECT id FROM Calendar_Event WHERE id = ? AND user_id = ?");
    $stmt->execute([$data['id'], $userId]);

    if (!$stmt->fetch()) {
      http_response_code(404);
      echo json_encode(['error' => 'Event not found or access denied']);
      exit;
    }

    // Update event
    $stmt = $pdo->prepare("
      UPDATE Calendar_Event 
      SET title = ?, description = ?, type = ?, event_time = ?, reminder_time = ?
      WHERE id = ? AND user_id = ?
    ");

    $stmt->execute([
      $data['title'],
      $data['description'] ?? null,
      $data['type'] ?? 'event',
      $data['event_time'],
      $data['reminder_time'] ?? null,
      $data['id'],
      $userId
    ]);

    // Fetch updated event
    $stmt = $pdo->prepare("SELECT * FROM Calendar_Event WHERE id = ?");
    $stmt->execute([$data['id']]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['event' => $event, 'message' => 'Event updated successfully']);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// DELETE - Delete an event
if ($method === 'DELETE') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Event ID is required']);
    exit;
  }

  try {
    // Check if event belongs to user before deleting
    $stmt = $pdo->prepare("SELECT id FROM Calendar_Event WHERE id = ? AND user_id = ?");
    $stmt->execute([$data['id'], $userId]);

    if (!$stmt->fetch()) {
      http_response_code(404);
      echo json_encode(['error' => 'Event not found or access denied']);
      exit;
    }

    // Delete event
    $stmt = $pdo->prepare("DELETE FROM Calendar_Event WHERE id = ? AND user_id = ?");
    $stmt->execute([$data['id'], $userId]);

    echo json_encode(['message' => 'Event deleted successfully']);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>