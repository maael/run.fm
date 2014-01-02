<?php
$username = $_POST['username'];
$text_color = $_POST['text_color'];
$bg = $_POST['bg'];
$user = include('..'.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'user.php');
$info = array();
$saved = $user->saveSettings($username,$text_color,$bg);
($saved) ? $info["success"] = true : $info["success"] = false;
print json_encode($info);