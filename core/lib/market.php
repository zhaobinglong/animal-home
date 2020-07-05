<?php
//允许的来源
header("Access-Control-Allow-Origin:*");
//OPTIONS通过后，保存的时间，如果不超过这个时间，是不会再次发起OPTIONS请求的。
header("Access-Control-Max-Age: 86400");
//!!!之前我碰到和你一样的问题，这个没有加导致的。
header("Access-Control-Allow-Headers: Content-Type");
//允许的请求方式
header("Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST, DELETE");
//允许携带cookie
header("Access-Control-Allow-Credentials: true");

header("Content-type: text/html; charset=utf-8");
// require __DIR__ . '/errcode.class.php';

// 返回pdo最后一次插入的自增id
// $this->db->lastInsertId()

// 数据库读写四部曲
// 拼写sql  $sql = 'select * from `user` where `openid` =:openid '
// 预处理 $stmt = $this->db->prepare($sql);
// 绑定   $stmt->bindParam(':openid',$openid);
// 执行 $stmt->execute();

// 获取结果集的方式
// 获取单条结果集 $res = $stmt->fetch(PDO::FETCH_ASSOC);
// 获取所有结果集 $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 函数设置默认参数
// public function list($id,$page = 1,$size = 10)

class market {

	// 数据库句柄
	private $db;
	public $post;
	public $from = 'ztd';
	public $openid = '0tnczsoyer39hlvwj85vpi5l80re';

	// 构造函数，将pdo句柄传递给类
	public function __construct($db) {
		$this->db = $db;
	}

	// 
	// public function login() {
	// 	$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
	// 	$this->mypost = json_decode($rws_post);
	// 	$sql = 'select * from user where account="' . $this->mypost->username . '" and pwd="' . $this->mypost->password . '" and belong="' . $this->mypost->belong . '" limit 1';
	// 	$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
	// 	$res['formId'] = unserialize($res['formId']);
	// 	$this->sendData($res, $sql);
	// }
              // name: item['货品名称'],
              // size: item['规格(单位)'],
              // price_pre: item['昨日价格'],
              // price_now: item['今日价格'],
              // price_updown: item['价格波动'],
              // order_num: item['订货量'],
              // remark: item['备注'],
              // weight: item['每件货大概重量']
    public function uploadExcel() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = 'insert into market(name,size,price_pre,price_now,price_updown,order_num,remark, weight,create_time) value("' . $mypost->name . '","' . $mypost->size . '","' . $mypost->price_pre . '","' . $mypost->price_now . '","' . $mypost->price_updown . '","' . $mypost->order_num . '", "'.$mypost->remark.'","'.$mypost->weight.'","' . strtotime("today"). '")';
		$res = $this->db->dql($sql);
		$this->sendData($res, $sql);
	}


	// 参数1：sql执行成功还是失败
	public function sendData($res, $sql = '') {
		$data['data'] = $res;
		$data['code'] = 200;
		$data['sql'] = $sql;
		echo json_encode($data);
	}

	// test
	public function test() {
		$date = $this->mypost->date;
		echo date("t", strtotime("$y-$i"));

		// $sql = 'select * from orders where (id="' . $this->mypost->id . '" or "' . $this->mypost->id . '"="") and (out_trade_no="' . $this->mypost->out_trade_no . '" or "' . $this->mypost->out_trade_no . '"="")';
		// $res = $this->db->dql($sql);
		// $data = array();
		// while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
		// 	$row['info'] = unserialize($row['list']);
		// 	array_push($data, $row);
		// }
		// $this->sendData($data, $sql);
	}

}