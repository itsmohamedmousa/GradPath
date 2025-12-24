<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../auth_utils.php';

/* Handle preflight */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$user = requireAuth();
$userId = $user->userId;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    try {
        $pdo->beginTransaction();
    
        /* 1️⃣ Get active semester */
        $stmt = $pdo->prepare("
            SELECT id
            FROM Semester
            WHERE user_id = ? AND status = 'active'
            LIMIT 1
        ");
        $stmt->execute([$userId]);
        $semester = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$semester) {
            throw new Exception('No active semester found');
        }
    
        $semesterId = $semester['id'];
    
        /* 2️⃣ Get courses in active semester */
        $stmt = $pdo->prepare("
            SELECT final_grade, credits, status
            FROM Course
            WHERE semester_id = ?
        ");
        $stmt->execute([$semesterId]);
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if (empty($courses)) {
            throw new Exception('No courses in active semester');
        }
    
        /* 3️⃣ Validate all courses are finalized */
        foreach ($courses as $course) {
            if (!in_array($course['status'], ['Passed', 'Failed'])) {
                throw new Exception('All courses must be passed or failed before ending the semester');
            }
        }
    
        /* 4️⃣ Calculate semester GPA */
        $qualityPoints = 0;
        $semesterCredits = 0;
    
        foreach ($courses as $course) {
            $qualityPoints += $course['final_grade'] * $course['credits'];
            $semesterCredits += $course['credits'];
        }
    
        if ($semesterCredits <= 0) {
            throw new Exception('Semester credits cannot be zero');
        }
    
        // Scale to 0–4 GPA
        $semesterGpa = round(($qualityPoints / $semesterCredits) / 25, 2);
    
        /* 5️⃣ Get cumulative GPA data */
        $stmt = $pdo->prepare("
            SELECT cumulative_gpa, completed_credits
            FROM GPA
            WHERE user_id = ?
            LIMIT 1
        ");
        $stmt->execute([$userId]);
        $gpa = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$gpa) {
            throw new Exception('GPA record not found');
        }
    
        $previousCumulativeGpa = (float)$gpa['cumulative_gpa'];
        $completedCredits = (int)$gpa['completed_credits'];
    
        /* 6️⃣ Calculate new cumulative GPA */
        $newTotalCredits = $completedCredits + $semesterCredits;
    
        $newCumulativeGpa = round(
            (
                ($previousCumulativeGpa * $completedCredits)
                + ($semesterGpa * $semesterCredits)
            ) / $newTotalCredits,
            2
        );
    
        /* 7️⃣ Update GPA table */
        $stmt = $pdo->prepare("
            UPDATE GPA
            SET cumulative_gpa = ?, completed_credits = ?
            WHERE user_id = ?
        ");
        $stmt->execute([$newCumulativeGpa, $newTotalCredits, $userId]);
    
        /* 8️⃣ End semester + save semester GPA */
        $stmt = $pdo->prepare("
            UPDATE Semester
            SET status = 'ended',
                end_date = CURDATE(),
                semester_gpa = ?
            WHERE id = ?
        ");
        $stmt->execute([$semesterGpa, $semesterId]);
    
        $pdo->commit();
    
        echo json_encode([
            'success' => true,
            'semester_gpa' => $semesterGpa,
            'cumulative_gpa' => $newCumulativeGpa,
            'semester_credits' => $semesterCredits,
            'completed_credits' => $newTotalCredits
        ]);
    
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT id, name, status, start_date
            FROM Semester
            WHERE user_id = ? AND status = 'active'
            LIMIT 1
        ");
        $stmt->execute([$userId]);
        $semester = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$semester) {
            echo json_encode([
                'success' => true,
                'data' => null
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'data' => $semester
        ]);
        exit;

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch current semester'
        ]);
        exit;
    }
}


