<?php
$username = $_POST['username'];
$user = include('..'.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'user.php');
$info = array();
$likes = $user->getLikes($username);
$info["likes"] = $likes;
print json_encode($info);