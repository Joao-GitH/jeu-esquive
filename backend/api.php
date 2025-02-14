<?php
//le va requérir plusieurs autres fichiers afin d'utilliser des fonctions ou des constantes
require_once "php/functions.php";
require_once "php/constants.php";
error_reporting(E_ALL);
ini_set('display_errors', '1');
//on récupère la méthode de requête + l'uri de la requête
$requestMethode = $_SERVER["REQUEST_METHOD"];
$requestUri = $_SERVER["REQUEST_URI"];

//tout les cas possible selon la méthode de la requête 
switch ($requestMethode) {
	case 'GET':
		//on va récupérer tout les utillisateurs avec leurs score
		$users = selectAllUsers();
		//on envoie les données
		sendData($users);
		break;
	case "POST":
		//on récupère les données dans le corps de la requête
		$post = fetchData();
		//on récupère les données qui nous intéresse
		$username = $post["username"];
		$score = $post["score"];
		//on va ensuite insérer les données dans le fichiers json et renvoyés les données
		if(insertScore($username, $score)){
			sendData([], HTTP_STATUS_CREATED);
		}
		break;

}
