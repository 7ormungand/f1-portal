<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO('mysql:host=MySQL-8.4;dbname=f1_db;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка подключения к БД: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM reviews WHERE approved = :status ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['status' => 1]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $output = [];
    foreach ($reviews as $review) {
        $output[] = [
            'name' => $review['name'],
            'text' => $review['text'],
            'date' => date('d.m.Y в H:i', strtotime($review['created_at']))
        ];
    }
    echo json_encode($output);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userName = trim($input['name'] ?? '');
    $userText = trim($input['reviewText'] ?? '');

    if ($userName === '' || $userText === '') {
        echo json_encode(['success' => false, 'error' => 'Пожалуйста, заполните все поля!']);
        exit;
    }

    $sql = "INSERT INTO reviews (name, text) VALUES (:placeholder_name, :placeholder_text)";
    $stmt = $pdo->prepare($sql);

    $success = $stmt->execute([
        'placeholder_name' => $userName,
        'placeholder_text' => $userText
    ]);

    echo json_encode(['success' => $success]);
    exit;
}
?>