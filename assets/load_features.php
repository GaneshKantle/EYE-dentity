<?php
header('Content-Type: application/json');

$baseDir = __DIR__ . '/assets';
$response = [];

foreach (scandir($baseDir) as $folder) {
    if ($folder === '.' || $folder === '..') continue;
    $folderPath = $baseDir . '/' . $folder;
    if (is_dir($folderPath)) {
        $files = glob($folderPath . '/*.png');
        $fileNames = array_map(function($file) use ($folder) {
            return "assets/$folder/" . basename($file);
        }, $files);
        $response[$folder] = $fileNames;
    }
}

echo json_encode($response);
