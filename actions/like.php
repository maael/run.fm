<?php
$username = $_POST['username'];
$track = $_POST['track'];
$user = include('..'.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'user.php');
$info = array();
$made = $user->addLike($username,$track);
($made) ? $info["success"] = true : $info["success"] = false;
print json_encode($info);