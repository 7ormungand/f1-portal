<?php
try {
    $pdo = new PDO('mysql:host=MySQL-8.4;dbname=f1_db;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка подключения к БД: ' . $e->getMessage()]);
    exit;
}

$sql = "SELECT * FROM drivers";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

$output = [];
foreach ($drivers as $driver) {
    $output[] = [
        'number' => $driver['number'],
        'name' => $driver['name'],
        'team' => $driver['team'],
        'born' => date('Y-m-d', strtotime($driver['born'])),
        'nat' => $driver['nationality'],
        'link' => $driver['link'],
        'img' => $driver['img'],
    ];
}
echo json_encode($output);
exit;
?>