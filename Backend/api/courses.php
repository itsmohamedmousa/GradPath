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

function getJSONInput()
{
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

function getAllCourses($pdo, $userId)
{
    try {
        $stmt = $pdo->prepare("SELECT * FROM Course WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $userId]);
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $courseIds = array_column($courses, 'id');
        if (!empty($courseIds)) {
            $in = str_repeat('?,', count($courseIds) - 1) . '?';
            $stmt2 = $pdo->prepare("SELECT * FROM Grade_Item WHERE course_id IN ($in)");
            $stmt2->execute($courseIds);
            $gradeItems = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            foreach ($courses as &$course) {
                // force reindex so it's always a clean array
                $course['grade_items'] = array_values(
                    array_filter($gradeItems, fn($g) => $g['course_id'] == $course['id'])
                );
            }
        } else {
            // if no courses, just return empty array
            $courses = [];
        }

        echo json_encode(['success' => true, 'data' => $courses]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch courses']);
    }
}


function addCourse($pdo, $userId)
{
    $data = getJSONInput();

    if (!isset($data['name'], $data['credits'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }

    $pdo->beginTransaction();
    try {
        // Insert course
        $sql = "INSERT INTO Course (name, credits, final_grade, status, user_id) 
                VALUES (:name, :credits, :final_grade, :status, :user_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':final_grade' => $data['final_grade'] ?? 0,
            ':status' => $data['status'],
            ':user_id' => $userId
        ]);

        $courseId = $pdo->lastInsertId();

        if (!empty($data['gradeItems']) && is_array($data['gradeItems'])) {
            $sqlItem = "INSERT INTO Grade_Item (course_id, title, score, weight, type) 
                        VALUES (:course_id, :title, :score, :weight, :type)";
            $stmtItem = $pdo->prepare($sqlItem);

            foreach ($data['gradeItems'] as $item) {
                $title = (isset($item['title']) && $item['title'] !== '') ? $item['title'] : 'Untitled';
                $weight = (isset($item['weight']) && $item['weight'] !== '') ? $item['weight'] : 0;
                $score = (isset($item['score']) && $item['score'] !== '') ? $item['score'] : null;
                $type = (isset($item['type']) && $item['type'] !== '') ? $item['type'] : 'Other';

                $stmtItem->execute([
                    ':course_id' => $courseId,
                    ':title' => $title,
                    ':score' => $score,
                    ':weight' => $weight,
                    ':type' => $type
                ]);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Course Added Successfully']);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to Add Course',
            'error' => $e->getMessage() // useful while debugging, remove in production
        ]);
    }
}


function editCourse($pdo, $userId)
{
    $data = getJSONInput();

    if (!isset($data['id'], $data['name'], $data['credits'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }

    $pdo->beginTransaction();
    try {
        // 1. Update the course
        $sql = "UPDATE Course 
                SET name = :name, credits = :credits, final_grade = :final_grade, status = :status 
                WHERE id = :id AND user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':final_grade' => $data['final_grade'] ?? 0,
            ':status' => $data['status'],
            ':id' => $data['id'],
            ':user_id' => $userId
        ]);

        if ($stmt->rowCount() === 0) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Course not found or not authorized']);
            return;
        }

        // 2. Update grade items: simple approach is to delete existing and re-insert
        $sqlDelete = "DELETE FROM Grade_Item WHERE course_id = :course_id";
        $stmtDelete = $pdo->prepare($sqlDelete);
        $stmtDelete->execute([':course_id' => $data['id']]);

        if (!empty($data['gradeItems']) && is_array($data['gradeItems'])) {
            $sqlInsert = "INSERT INTO Grade_Item (course_id, title, score, weight, type) 
                          VALUES (:course_id, :title, :score, :weight, :type)";
            $stmtInsert = $pdo->prepare($sqlInsert);

            foreach ($data['gradeItems'] as $item) {
                $title = (isset($item['title']) && $item['title'] !== '') ? $item['title'] : 'Untitled';
                $weight = (isset($item['weight']) && $item['weight'] !== '') ? $item['weight'] : 0;
                $score = (isset($item['score']) && $item['score'] !== '') ? $item['score'] : null;
                $type = (isset($item['type']) && $item['type'] !== '') ? $item['type'] : 'Other';

                $stmtInsert->execute([
                    ':course_id' => $data['id'],
                    ':title' => $title,
                    ':score' => $score,
                    ':weight' => $weight,
                    ':type' => $type
                ]);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Course updated successfully']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update course',
            'error' => $e->getMessage()
        ]);
    }
}

function deleteCourse($pdo, $userId)
{
    $data = getJSONInput();
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
