<?php

//db.class.php
//include('config.php');
use Medoo\Medoo;
class DB {

	// unibb阿里云服务器信息
	// host=154.8.226.223
	// port=3306
	// user=root
	// passwd=3ZbvwYRUFc
	// db=uniapi
	// charset=utf8

	//  本地测试通过
	// public $dbname = 'uniapi';
	// public $host = '154.8.226.223';
	// public $user = 'root'; //用户名(api key)
	// public $pwd = '3ZbvwYRUFc'; //密码(secret key)
	// public $conn;
	// public $port = 3306;
 //    public $database;
	// public function __construct() {
	// 	$this->database = new medoo([
	// 	    'database_type' => 'mysql',
	// 	    'database_name' => 'uniapi',
	// 	    'server' => '154.8.226.223',
	// 	    'username' => 'root',
	// 	    'password' => '3ZbvwYRUFc',
	// 	    'charset' => 'utf8'
	// 	]);

		// var_dump($this->database);

		$this->conn = @mysql_connect($this->host . ':' . $this->port, $this->user, $this->pwd, true);
		mysql_select_db($this->dbname, $this->conn);
	}

	//查询
	public function dql($sql) {
		// 这句代码很重要,一定要设置,否则数据库不能存中文
		mysql_query("set names utf8mb4");
		$data = mysql_query($sql, $this->conn);
		// $data = $this->database->query($sql)->fetchAll();
		// var_dump($data);
		return $data;
	}

	public function __destruct() {
	}

}
