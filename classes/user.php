<?php
require('db.php');
class user {
    private $db = null;
    private $auth = false;
    private $id = null;
    function __construct(){
        $this->db = new db();
        $this->db->query("CREATE TABLE IF NOT EXISTS ".USERS_TABLE."(id MEDIUMINT NOT NULL AUTO_INCREMENT, username varchar(32) NOT NULL UNIQUE, password varchar(128) NOT NULL, PRIMARY KEY(id));");
        $this->db->query("CREATE TABLE IF NOT EXISTS ".LIKES_TABLE."(id MEDIUMINT NOT NULL AUTO_INCREMENT, userid MEDIUMINT NOT NULL, track TEXT NOT NULL, PRIMARY KEY(id));");
        $this->db->query("CREATE TABLE IF NOT EXISTS ".SETTINGS_TABLE."(userid MEDIUMINT NOT NULL UNIQUE, text_color varchar(8) NOT NULL, bg TEXT, PRIMARY KEY(userid));");
    }
    public function addUser($username, $password){
        $result = $this->db->query("SELECT id FROM ".USERS_TABLE." WHERE username = :username",array(':username'=>$username));
        if(count($result)>0||$result===false){
            return false;
        } else {
            $result = $this->db->query("INSERT INTO ".USERS_TABLE." (username, password) VALUES (:username, :password)",array(':username'=>$username,':password'=>$password));
            return true;
        }
    }
    public function auth($username,$password){
        if($this->auth == false){
            $result = $this->db->query("SELECT id,password FROM ".USERS_TABLE." WHERE username = :username",array(':username'=>$username));
            if(count($result)>0){if($result[0]['password']==($password)){$this->auth = true;$this->id = $result[0]['id'];return true;}else{return false;}}else{return false;}
        } else {
            return true;
        }
    }
    public function addLike($username, $track){
        $userid = $this->db->query("SELECT id FROM ".USERS_TABLE." WHERE username = :username",array(':username'=>$username));
        $userid = $userid[0]['id'];
        $result = $this->db->query("INSERT INTO ".LIKES_TABLE." (userid, track) VALUES (:userid, :track)",array(':userid'=>$userid,':track'=>(serialize($track))));
        if(count($result)>0||$result===false){
            return false;
        } else {
            return true;
        }
    }
    public function getLikes($username){
        $userid = $this->db->query("SELECT id FROM ".USERS_TABLE." WHERE username = :username",array(':username'=>$username));
        $userid = $userid[0]['id'];
        $result = $this->db->query("SELECT track FROM ".LIKES_TABLE." WHERE userid = :userid",array(':userid'=>$userid));
        $output = array();
        foreach($result as $track){
            $output[] = unserialize($track['track']);
        }
        return $output;
    }
    public function saveSettings($username, $text_color, $bg){
        $userid = $this->db->query("SELECT id FROM ".USERS_TABLE." WHERE username = :username",array(':username'=>$username));
        $userid = $userid[0]['id'];
        $result = $this->db->query("SELECT text_color,bg FROM ".SETTINGS_TABLE." WHERE userid = :userid",array(':userid'=>$this->id));
        if(count($result)>0){
            $result = $this->db->query("UPDATE ".SETTINGS_TABLE." SET text_color = :text_color, bg = :bg WHERE userid = :userid",array(':userid'=>$userid,":text_color"=>$text_color,":bg"=>$bg));
        }else{
            $result = $this->db->query("INSERT INTO ".SETTINGS_TABLE."(userid, text_color,bg) VALUES (:userid,:text_color,:bg)",array(':userid'=>$userid,":text_color"=>$text_color,":bg"=>$bg));
        }
        $result = $this->db->query("UPDATE ".SETTINGS_TABLE." SET text_color = :text_color, bg = :bg WHERE userid = :userid",array(':userid'=>$userid,":text_color"=>$text_color,":bg"=>$bg));        
        if(count($result)>0||$result===false){
            return false;
        } else {
            return true;
        }
    }
    public function getSettings($username){
        if($this->auth){
            $result = $this->db->query("SELECT text_color,bg FROM ".SETTINGS_TABLE." WHERE userid = :userid",array(':userid'=>$this->id));
            if(count($result)>0){return $result[0];}else{return false;}           
        } else {return array();}
    }
}
return new user();