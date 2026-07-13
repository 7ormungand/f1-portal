<?php
try {
    $pdo = new PDO('mysql:host=MySQL-8.4;dbname=f1_db;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка подключения к БД: ' . $e->getMessage()]);
    exit;
}

$sql = "SELECT * FROM news";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$news = $stmt->fetchAll(PDO::FETCH_ASSOC);

$output = [];
foreach ($news as $new) {
    $output[] = [
        'title' => $new['title'],
        'link' => $new['link'],
        'date' => date('d/m', strtotime($new['created_at']))
    ];
}
echo json_encode($output);
exit;
?>