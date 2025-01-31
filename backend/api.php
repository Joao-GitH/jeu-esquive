<?php
require_once "php/functions.php";
require_once "php/constants.php";
error_reporting(E_ALL);
ini_set('display_errors', '1');

$requestMethode = $_SERVER["REQUEST_METHOD"];
$requestUri = $_SERVER["REQUEST_URI"];

switch ($requestMethode) {
	case 'GET':
		$users = selectAllUsers();
		sendData($users);
		break;
	case "POST":
		$post = fetchData();
		$username = $post["username"];
		$score = $post["score"];
		if(insertScore($username, $score)){
			sendData([], HTTP_STATUS_CREATED);
		}
		break;
	default:
		
		break;
}