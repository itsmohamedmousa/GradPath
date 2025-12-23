<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$uploadDir = __DIR__ . "/public/uploads/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES["image"])) {
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

$file = $_FILES["image"];
$allowedTypes = ["image/jpeg", "image/png", "image/webp"];

if (!in_array($file["type"], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type"]);
    exit;
}

$extension = pathinfo($file["name"], PATHINFO_EXTENSION);
$filename = uniqid("profile_", true) . "." . $extension;
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Upload failed"]);
    exit;
}

$imageUrl = "http://localhost:8000/api/public/uploads/" . $filename;

echo json_encode([
    "success" => true,
    "imageUrl" => $imageUrl
]);
