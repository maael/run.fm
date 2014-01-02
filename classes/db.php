<?php
    require("..".DIRECTORY_SEPARATOR."config.php");
    class db{
        private $conn = null;
        function __construct(){
            $this->connect();
        }
        function __destruct(){
            $this->disconnect();
        }
        private function error($message){
            echo $message;
            exit;
        }
        public function connect(){
            if(is_null($this->conn)){
                try{
                    if((DB_ENGINE=="mysql")){
                        $this->conn = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
                    } else if(DB_ENGINE=="sqlite"){
                        $this->conn = new PDO('sqlite:'.DB_NAME);
                    }
                    $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    if(is_null($this->conn)){
                        error('',"Count not connect to database '".DB_NAME."' as user '".DB_USER."'.");
                    }
                } catch(PDOException $e) {
                    $this->error('',$e->getMessage());
                }
            }
        }
        public function disconnect(){
            $this->conn = null;
        }
        public function query($querystring,$queryparams=null){
            $STH = $this->conn->prepare($querystring);
            $result = False;
            if(!is_null($queryparams)){
                try{
                    $result = $STH->execute($queryparams);
                } catch(PDOException $e) {
                    $output = false;
                }
            }else{
                $result = $STH->execute();
            }
            $STH->setFetchMode(PDO::FETCH_BOTH);
            try {
                $output = $STH->fetchAll();
            } catch(PDOException $e) {
               $output = null;
            }
            return $output;
        }    
    }