<?php
$username = $_POST['username'];
$password = $_POST['password'];
$user = include('..'.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'user.php');
if($user->auth($username,$password)){
    $info = array();
    $info["username"] = $username;
    $settings = $user->getSettings($username);
    if(count($settings)>0){
        $info["color"] = $settings["text_color"];
        $info["bg"] = $settings["bg"];
    } else {
        $info["color"] = "FFFFFF";
        $info["bg"] = "";        
    }
    print json_encode($info);
}