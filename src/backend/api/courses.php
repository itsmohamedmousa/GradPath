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
    if (!$userId) {
        throw new Exception('User ID missing in token');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit;
}

$action = $_GET['action'] ?? null;

function getJSONInput() {
    return json_decode(file_get_contents("php://input"), true);
}

switch ($method) {
    case 'GET':
        if ($action === 'allCourses') {
            getAllCourses($GLOBALS['pdo'], $userId);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid GET action']);
        }
        break;

    case 'POST':
        if ($action === 'add') {
            addCourse($GLOBALS['pdo'], $userId);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid POST action']);
        }
        break;

    case 'PUT':
        if ($action === 'edit') {
            editCourse($GLOBALS['pdo'], $userId);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid PUT action']);
        }
        break;

    case 'DELETE':
        if ($action === 'delete') {
            deleteCourse($GLOBALS['pdo'], $userId);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid DELETE action']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getAllCourses($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM Course WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $userId]);
        $courses = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $courses]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch courses']);
    }
}

function addCourse($pdo, $userId) {
    $data = getJSONInput();
    if (!isset($data['name'], $data['credits'], $data['grade'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    $sql = "INSERT INTO Course (name, credits, grade, user_id) VALUES (:name, :credits, :grade, :user_id)";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':grade' => $data['grade'],
            ':user_id' => $userId
        ]);
        echo json_encode(['success' => true, 'message' => 'Course added']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add course']);
    }
}

function editCourse($pdo, $userId) {
    $data = getJSONInput();
    if (!isset($data['id'], $data['name'], $data['credits'], $data['grade'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    $sql = "UPDATE Course SET name = :name, credits = :credits, grade = :grade WHERE id = :id AND user_id = :user_id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':grade' => $data['grade'],
            ':id' => $data['id'],
            ':user_id' => $userId
        ]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Course not found or not authorized']);
            return;
        }
        echo json_encode(['success' => true, 'message' => 'Course updated']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update course']);
    }
}

function deleteCourse($pdo, $userId) {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing course ID']);
        return;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM Course WHERE id = :id AND user_id = :user_id");
        $stmt->execute([':id' => $id, ':user_id' => $userId]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Course not found or not authorized']);
            return;
        }
        echo json_encode(['success' => true, 'message' => 'Course deleted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete course']);
    }
}
