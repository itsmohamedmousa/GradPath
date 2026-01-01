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

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User ID missing in token']);
    exit;
}

$action = $_GET['action'] ?? null;

function getJSONInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

function getCurrentSemesterName()
{
    $month = (int) date('n');
    $year = date('Y');
    if ($month >= 1 && $month <= 5)
        return "Spring $year";
    if ($month >= 6 && $month <= 8)
        return "Summer $year";
    return "Fall $year";
}

function getOrCreateActiveSemester($pdo, $userId)
{
    $stmt = $pdo->prepare("
        SELECT id
        FROM Semester
        WHERE user_id = ? AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute([$userId]);
    $semester = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($semester) {
        return $semester['id'];
    }

    $name = getCurrentSemesterName();

    $stmt = $pdo->prepare("
        SELECT id
        FROM Semester
        WHERE user_id = ? AND name = ?
        LIMIT 1
    ");
    $stmt->execute([$userId, $name]);
    $existingSemester = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingSemester) {
        $stmt = $pdo->prepare("
            UPDATE Semester
            SET status = 'active'
            WHERE id = ?
        ");
        $stmt->execute([$existingSemester['id']]);

        return $existingSemester['id'];
    }

    $stmt = $pdo->prepare("
        INSERT INTO Semester (user_id, name, start_date, status)
        VALUES (?, ?, CURDATE(), 'active')
    ");
    $stmt->execute([$userId, $name]);

    return $pdo->lastInsertId();
}


/* ------------------- CRUD ------------------- */
switch ($method) {
    case 'GET':
        if ($action === 'allCourses')
            getAllCourses($GLOBALS['pdo'], $userId);
        else
            http_response_code(400) && exit(json_encode(['success' => false, 'message' => 'Invalid GET action']));
        break;

    case 'POST':
        if ($action === 'add')
            addCourse($GLOBALS['pdo'], $userId);
        else
            http_response_code(400) && exit(json_encode(['success' => false, 'message' => 'Invalid POST action']));
        break;

    case 'PUT':
        if ($action === 'edit')
            editCourse($GLOBALS['pdo'], $userId);
        else
            http_response_code(400) && exit(json_encode(['success' => false, 'message' => 'Invalid PUT action']));
        break;

    case 'DELETE':
        if ($action === 'delete')
            deleteCourse($GLOBALS['pdo'], $userId);
        else
            http_response_code(400) && exit(json_encode(['success' => false, 'message' => 'Invalid DELETE action']));
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

/* ------------------- FUNCTIONS ------------------- */
function getAllCourses($pdo, $userId)
{
    try {
        $stmt = $pdo->prepare("SELECT c.* FROM Course c JOIN Semester s ON c.semester_id = s.id WHERE c.user_id = :user_id AND s.status = 'active'");
        $stmt->execute([':user_id' => $userId]);
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $courseIds = array_column($courses, 'id');
        if (!empty($courseIds)) {
            $in = str_repeat('?,', count($courseIds) - 1) . '?';
            $stmt2 = $pdo->prepare("SELECT * FROM Grade_Item WHERE course_id IN ($in)");
            $stmt2->execute($courseIds);
            $gradeItems = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            foreach ($courses as &$course) {
                $course['grade_items'] = array_values(
                    array_filter($gradeItems, fn($g) => $g['course_id'] == $course['id'])
                );
            }
        }

        echo json_encode(['success' => true, 'data' => $courses]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch courses', 'error' => $e->getMessage()]);
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
        $semesterId = getOrCreateActiveSemester($pdo, $userId);
        $stmt = $pdo->prepare("INSERT INTO Course (name, credits, final_grade, status, user_id, semester_id) 
                               VALUES (:name, :credits, :final_grade, :status, :user_id, :semester_id)");
        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':final_grade' => $data['final_grade'] ?? null,
            ':status' => $data['status'] ?? 'Registered',
            ':user_id' => $userId,
            ':semester_id' => $semesterId
        ]);
        $courseId = $pdo->lastInsertId();

        if (!empty($data['gradeItems']) && is_array($data['gradeItems'])) {
            $stmtItem = $pdo->prepare("INSERT INTO Grade_Item (course_id, title, score, weight, type) VALUES (:course_id, :title, :score, :weight, :type)");
            foreach ($data['gradeItems'] as $item) {
                $stmtItem->execute([
                    ':course_id' => $courseId,
                    ':title' => $item['title'] ?? 'Untitled',
                    ':score' => $item['score'] ?? null,
                    ':weight' => $item['weight'] ?? 0,
                    ':type' => $item['type'] ?? 'Other'
                ]);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Course Added Successfully']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to Add Course', 'error' => $e->getMessage()]);
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
        $stmt = $pdo->prepare("UPDATE Course 
                               SET name = :name, 
                                   credits = :credits, 
                                   final_grade = :final_grade, 
                                   status = :status
                               WHERE id = :id 
                               AND user_id = :user_id 
                               AND semester_id IN (SELECT id FROM Semester WHERE user_id = :user_id AND status = 'active')");

        $stmt->execute([
            ':name' => $data['name'],
            ':credits' => $data['credits'],
            ':final_grade' => isset($data['final_grade']) ? $data['final_grade'] : null,
            ':status' => $data['status'] ?? 'Registered',
            ':id' => $data['id'],
            ':user_id' => $userId
        ]);

        $stmtDelete = $pdo->prepare("DELETE FROM Grade_Item WHERE course_id = :course_id");
        $stmtDelete->execute([':course_id' => $data['id']]);

        if (!empty($data['gradeItems']) && is_array($data['gradeItems'])) {
            $stmtInsert = $pdo->prepare("INSERT INTO Grade_Item (course_id, title, score, weight, type) 
                                         VALUES (:course_id, :title, :score, :weight, :type)");
            foreach ($data['gradeItems'] as $item) {
                $score = ($item['score'] === '' || $item['score'] === null) ? null : $item['score'];

                $stmtInsert->execute([
                    ':course_id' => $data['id'],
                    ':title' => $item['title'] ?? 'Untitled',
                    ':score' => $score,
                    ':weight' => $item['weight'] ?? 0,
                    ':type' => $item['type'] ?? 'Other'
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
        $stmt = $pdo->prepare("DELETE FROM Course WHERE id = :id AND user_id = :user_id AND semester_id IN (SELECT id FROM Semester WHERE user_id = :user_id AND status = 'active')");
        $stmt->execute([':id' => $id, ':user_id' => $userId]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Course not found or not authorized']);
            return;
        }

        echo json_encode(['success' => true, 'message' => 'Course deleted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete course', 'error' => $e->getMessage()]);
    }
}
