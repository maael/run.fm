<?php
$username = $_POST['username'];
$password = $_POST['password'];
$user = include('..'.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'user.php');
$made = $user->addUser($username,$password);
$info = array();
($made) ? $info["username"] = $username : $info["username"] = $made;
print json_encode($info);