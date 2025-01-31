<?php
require_once "php/constants.php";

function sendData(array $data, int $httpStatus = HTTP_STATUS_OK): void {
	http_response_code($httpStatus);
	header('Content-type: application/json; charset=utf-8');
	echo json_encode($data);
	die();
}

function fetchData(): array {
	$content = file_get_contents("php://input");
	if ($content === false) {
		return [];
	}
	$data = json_decode($content, true);
	if (!is_array($data)) {
		return [];
	}
	return $data;
}

function refactorUsers(array $users): array {
	$refactoredUsers = [];
	foreach ($users as $key => $value) {
		$refactoredUsers[] = [
			"username" => $key,
			"score" => $value["score"]
		];
	}
	return $refactoredUsers;
}

function selectAllUsers(): array{
	$users = json_decode(file_get_contents(jsonSrc), true);
	return refactorUsers($users["users"]);
}

function selectUserByUsername(string $username): array {
	$users = json_decode(file_get_contents(jsonSrc), true);
	if(!array_key_exists($username, $users)){
		return false;
	}
	return [
		"username" => $username,
		"score" => $users[$username]["score"]
	];
}

function insertScore(string $username, int $score) {
	$users = json_decode(file_get_contents(jsonSrc), true)["users"];
	if(!array_key_exists($username, $users) || $users[$username]["score"] < $score){
		$users[$username] = [
			"score" => $score
		];
		file_put_contents(jsonSrc, json_encode(["users" => $users]));
		return true;
	}
	return false;
}