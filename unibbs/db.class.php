<?php

class db {
	public $dbname = 'uniapi';
	public $host = '154.8.226.223';
	public $user = 'root'; //用户名(api key)
	public $pwd = '3ZbvwYRUFc'; //密码(secret key)
	public $conn;
	public $port = 3306;
    public $database;

	public function __construct() {
		$this->conn = mysqli_connect($this->host . ':' . $this->port, $this->user, $this->pwd, $this->dbname);
		// 检测连接
		if ($this->conn->connect_error) {
		    die("连接失败: " . $this->conn->connect_error);
		} 
		mysqli_query($this->conn,'set names utf8mb4');
	}

	//查询
	public function dql($sql) {
		// 这句代码很重要,一定要设置,否则数据库不能存中文
		$res = mysqli_query($this->conn,$sql);
		return $res;
	}

	// 静态方法类  给::调用
	public static function d($sql) {
		// 这句代码很重要,一定要设置,否则数据库不能存中文
		mysql_query("set names utf8mb4");
		$res = mysql_query($sql);
		return $res;
	}

	public function __destruct() {
	    mysqli_close($this->conn);
	}

}
