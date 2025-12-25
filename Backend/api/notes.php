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

// Helper function to get tags for a note
function getNoteTags($pdo, $noteId)
{
  $stmt = $pdo->prepare("
    SELECT t.id, t.name 
    FROM Tag t
    INNER JOIN Note_Tag nt ON t.id = nt.tag_id
    WHERE nt.note_id = ?
  ");
  $stmt->execute([$noteId]);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Helper function to update note tags
function updateNoteTags($pdo, $noteId, $tagNames)
{
  // First, delete existing tags for this note
  $stmt = $pdo->prepare("DELETE FROM Note_Tag WHERE note_id = ?");
  $stmt->execute([$noteId]);

  if (empty($tagNames)) {
    return;
  }

  // Insert new tags
  foreach ($tagNames as $tagName) {
    $tagName = trim($tagName);
    if (empty($tagName))
      continue;

    // Get or create tag
    $stmt = $pdo->prepare("SELECT id FROM Tag WHERE name = ?");
    $stmt->execute([$tagName]);
    $tag = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tag) {
      // Create new tag
      $stmt = $pdo->prepare("INSERT INTO Tag (name) VALUES (?)");
      $stmt->execute([$tagName]);
      $tagId = $pdo->lastInsertId();
    } else {
      $tagId = $tag['id'];
    }

    // Link tag to note
    $stmt = $pdo->prepare("INSERT INTO Note_Tag (note_id, tag_id) VALUES (?, ?)");
    $stmt->execute([$noteId, $tagId]);
  }
}

// GET - Fetch all notes for the user with their tags
if ($method === 'GET') {
  try {
    $stmt = $pdo->prepare("SELECT id, user_id, title, content, subject, created_at, updated_at FROM Notes WHERE user_id = ?");
    $stmt->execute([$userId]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add tags to each note
    foreach ($notes as &$note) {
      $note['tags'] = getNoteTags($pdo, $note['id']);
    }

    echo json_encode(['notes' => $notes]);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// PUT - Update a note and its tags
if ($method === 'PUT') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Note ID is required']);
    exit;
  }

  $noteId = $data['id'];

  try {
    // Start transaction
    $pdo->beginTransaction();

    // First, verify the note belongs to the user
    $stmt = $pdo->prepare("SELECT id FROM Notes WHERE id = ? AND user_id = ?");
    $stmt->execute([$noteId, $userId]);
    $note = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$note) {
      $pdo->rollBack();
      http_response_code(404);
      echo json_encode(['error' => 'Note not found or unauthorized']);
      exit;
    }

    // Build dynamic update query based on provided fields
    $updateFields = [];
    $params = [];

    if (isset($data['title'])) {
      $updateFields[] = "title = ?";
      $params[] = $data['title'];
    }

    if (isset($data['content'])) {
      $updateFields[] = "content = ?";
      $params[] = $data['content'];
    }

    if (isset($data['subject'])) {
      $updateFields[] = "subject = ?";
      $params[] = $data['subject'];
    }

    // Always update the updated_at timestamp
    $updateFields[] = "updated_at = CURRENT_TIMESTAMP";

    if (count($updateFields) > 1) { // More than just updated_at
      // Add note ID and user ID to params for WHERE clause
      $params[] = $noteId;
      $params[] = $userId;

      $sql = "UPDATE Notes SET " . implode(", ", $updateFields) . " WHERE id = ? AND user_id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
    }

    // Update tags if provided
    if (isset($data['tags'])) {
      updateNoteTags($pdo, $noteId, $data['tags']);
    }

    // Commit transaction
    $pdo->commit();

    // Fetch and return the updated note with tags
    $stmt = $pdo->prepare("SELECT id, user_id, title, content, subject, created_at, updated_at FROM Notes WHERE id = ?");
    $stmt->execute([$noteId]);
    $updatedNote = $stmt->fetch(PDO::FETCH_ASSOC);
    $updatedNote['tags'] = getNoteTags($pdo, $noteId);

    echo json_encode([
      'success' => true,
      'message' => 'Note updated successfully',
      'note' => $updatedNote
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// DELETE - Delete a note and its tag associations
if ($method === 'DELETE') {
  // Get note ID from query parameter
  if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Note ID is required']);
    exit;
  }

  $noteId = $_GET['id'];

  try {
    // Start transaction
    $pdo->beginTransaction();

    // First, verify the note belongs to the user
    $stmt = $pdo->prepare("SELECT id FROM Notes WHERE id = ? AND user_id = ?");
    $stmt->execute([$noteId, $userId]);
    $note = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$note) {
      $pdo->rollBack();
      http_response_code(404);
      echo json_encode(['error' => 'Note not found or unauthorized']);
      exit;
    }

    // Delete tag associations first
    $stmt = $pdo->prepare("DELETE FROM Note_Tag WHERE note_id = ?");
    $stmt->execute([$noteId]);

    // Delete the note
    $stmt = $pdo->prepare("DELETE FROM Notes WHERE id = ? AND user_id = ?");
    $stmt->execute([$noteId, $userId]);

    // Commit transaction
    $pdo->commit();

    echo json_encode([
      'success' => true,
      'message' => 'Note deleted successfully'
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  }
  exit;
}

// If method is not supported
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>