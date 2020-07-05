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

header('Content-Type:application/json; charset=utf-8');
// require __DIR__ . '/errcode.class.php';

// 返回pdo最后一次插入的自增id
// $this->db->lastInsertId()
require_once __ROOT__ . '/wxlittle.class.php';
require_once __ROOT__ . '/http.class.php';


// https://simplehtmldom.sourceforge.io/
// 介绍：https://simplehtmldom.sourceforge.io/manual.htm
use Sunra\PhpSimple\HtmlDomParser;

// https://guzzle-cn.readthedocs.io/zh_CN/latest/overview.html#installation
use GuzzleHttp\Client;


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


// require_once __ROOT__ . '/core/common/goods_redis.php';

class api {

	// 数据库句柄
	public $db;
	public $post;
	public $from = 'unibbs';
    public $http;
    public $mapCollege = array(
         '运城学院' => 'ycu',
         '太原工业学院' => 'tit'
	);

	// 构造函数，将pdo句柄传递给类
	public function __construct($db) {
		$this->db = $db;
		$rws_post = isset($GLOBALS['HTTP_RAW_POST_DATA']) ? $GLOBALS['HTTP_RAW_POST_DATA'] : file_get_contents("php://input");
		$this->mypost = json_decode($rws_post);
		$this->http = new http();
	}

	// test
	public function test() {
       // $jssdk = new wxlittle();
       $token = '31_ysScONsR6-0ItNrMPln1lKfCStahnAE1Fs4ts8TrzP47-9HsXbdKHeO0Mdm8xSql27CplnOgZdicLlJXT0J49R_5iH2-SuKvayr66Lx-CoA8P03gQQsytMatseqlxvE2YDLSn2WRZyyKJtpdATFfACALEQ';
       $http = new http();
       $url = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='.$token;

       $content = array(
       	 'content' => "习大大毒品yuuo莞6543李zxcz蒜7782法fgnv级完2347全dfji试3726测asad感3847知qwez到");
       $res = $http->httpsPost($url, $content);
       var_dump( json_decode($res)->errmsg); 

	}

	public function getOpenid() {
		$jssdk = new wxlittle();
		$res = $jssdk->getOpenid($this->mypost->code);
		$this->sendData(json_decode($res));
	}

	// 查询帖子中的所有城市
	public function getCitys() {
		$sql = "select city from ershou where city !='' group by city";
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 记录访客数量
	public function takeNote() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = 'insert into visitior(openid,college,date,time) value("' . $mypost->openid . '","' . $mypost->college . '","' . date('Y-m-d', time()) . '","' . date('H:i:s', time()) . '")';
		$res = $this->db->dql($sql);

		// 当前日期当前学校的访客+1
		// $redis = new GoodsRedis();
		// $redis->newAddVisterNum($goods_id, $comment_id, $mypost);

		$this->sendData($res, $sql);
	}

	public function editBanner() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = '';
		if (isset($mypost->id)) {
			$sql = 'update banner set img="' . $mypost->img . '",title="' . $mypost->title . '", status="' . $mypost->status . '" where id="' . $mypost->id . '"';
		} else {
			$sql = 'insert into banner(img,title,createtime,belong) value("' . $mypost->img . '","' . $mypost->title . '","' . time() . '", "' . $mypost->belong . '")';
		}

		$res = $this->db->dql($sql);
		$this->sendData($res, $sql);
	}

	// 获取banner
	public function getBanner() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = 'select * from banner where status!="0" and belong="' . $mypost->belong . '" and (id="' . $mypost->id . '" or "' . $mypost->id . '" = "")';
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 获取用户信息
	public function getInfo() {
		$sql = 'select * from user where openid ="'.$this->mypost->openid.'" limit 1';
		$res = $this->db->dql($sql)->fetch_object();
		$this->sendData($res);
	}

	public function chooseCollege() {

		$sql = 'update user set college="' . $this->mypost->college . '" where openid="' . $this->mypost->openid . '"';
		$res = $this->db->dql($sql);
		$this->sendData($res, $sql);
	}

	// 根据关键词模糊搜索
	public function search() {
		if (!isset($this->mypost->page)) {
			$this->mypost->page = 0;
		}

		if (!isset($this->mypost->size)) {
			$this->mypost->size = 20;
		}
		$sql = 'SELECT e.id,e.openid,e.title,e.cont,e.college,e.imgs,e.imgs_detail,e.old_price,e.status,e.classify,e.category,e.updatetime,u.nickName,u.avatarUrl,u.status as user_status from ershou as e  left join user as u on e.openid = u.openid where cont like "%' . $this->mypost->keyword . '%" and (e.college="' . $this->mypost->college . '" or ""="")  and e.status!=0  and e.openid!="" order by updatetime desc limit ' . $this->mypost->page * $this->mypost->size . ',' . $this->mypost->size;
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['imgs'] = unserialize($row['imgs']);
			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 查询的条件存在时就查询，不存在就跳过该条件使用其他条件查询
	public function getList() {
		if (!isset($this->mypost->belong)) {
			$this->mypost->belong = '';
		}
		if (!isset($this->mypost->page)) {
			$this->mypost->page = 0;
		}
		if (!isset($this->mypost->openid)) {
			$this->mypost->openid = '';
		}
		if (!isset($this->mypost->classify)) {
			$this->mypost->classify = '';
		}
		if (!isset($this->mypost->category)) {
			$this->mypost->category = '';
		}
		$sql = 'SELECT e.id,e.openid,e.title,e.cont,e.college,e.imgs,e.imgs_detail,e.symbol,e.price,e.old_price,e.status,e.city,e.address,e.phone,e.level,e.classify,e.category,e.message,e.views,e.liked,e.updatetime,u.nickName,u.avatarUrl,u.status as user_status from ershou as e  left join user as u on e.openid = u.openid where (e.college="' . $this->mypost->college . '"  and e.status="1" and (e.classify="' . $this->mypost->classify . '" or "' . $this->mypost->classify . '" = "") and (e.category="' . $this->mypost->category . '" or "' . $this->mypost->category . '" = "") and (e.openid="' . $this->mypost->openid . '" or "' . $this->mypost->openid . '" = "") and (e.belong="' . $this->mypost->belong . '" or "' . $this->mypost->belong . '" ="") and e.openid!="") or e.classify="通知公告" order by updatetime desc limit ' . $this->mypost->page * 20 . ',20 ';
		$res = $this->db->dql($sql);
		$data = array();

		// $redis = new GoodsRedis();
		while ($row = $res->fetch_assoc()) {
			$row['imgs'] = unserialize($row['imgs']);
			array_push($data, $row);
		}

		$this->sendData($data, $sql);
	}

	// 获取指定用户发布的帖子
	public function getListByUser() {
		$sql = 'SELECT e.id,e.openid,e.title,e.cont,e.college,e.imgs,e.imgs_detail,e.symbol,e.price,e.old_price,e.status,e.city,e.address,e.phone,e.level,e.classify,e.category,e.message,e.views,e.liked,e.updatetime,u.nickName,u.avatarUrl,u.status as user_status from ershou as e  left join user as u on e.openid = u.openid where e.status!=0 and  e.openid="' . $this->mypost->openid . '"  order by updatetime desc ';
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['imgs'] = unserialize($row['imgs']);
			array_push($data, $row);
		}

		$this->sendData($data, $sql);
	}

	// 获取帖子详情
	public function getDetail() {
		$sql = 'select e.id,e.openid,e.title,e.cont,e.college,e.imgs,e.imgs_detail,e.symbol,e.price,e.old_price,e.address,e.wechat,e.nation,e.city,e.is_new,e.level,e.classify,e.category,e.updatetime,e.status,e.belong,u.nickName,u.avatarUrl from ershou e left join  user u on u.openid = e.openid where e.id="'. $this->mypost->id .'"';
		$res = $this->db->dql($sql)->fetch_object();
		$res->imgs = unserialize($res->imgs);
		$res->imgs_detail = unserialize($res->imgs_detail);
		$this->sendData($res);
		// 请求完毕后，阅读数加1
		$sql = 'update ershou set views=views+1 where id = "' . $this->mypost->id . '"';
		$this->db->dql($sql);

	}

	// 获取帖子相关参与信息
	public function getComment() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = 'select m.id,m.fromopenid,m.cont,m.tag,m.createtime,m.status,u.avatarUrl,u.nickName  from message m left join user u on u.openid = m.fromopenid where  m.ershou="' . $mypost->id . '" order by m.createtime ';
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			$row['imgs'] = unserialize($row['imgs']);
			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 获取我的所有评论
	public function getMyComments() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = 'select * from comment where openid="' . $mypost->openid . '" order by createtime desc';
		$res = $this->db->dql($sql);
		$data = array();
		while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 更新用户信息
	public function editUser() {

		$sql = 'insert into user(openid,avatarUrl,nickName,createtime,belong) value("' . $this->mypost->openid . '","' . $this->mypost->avatarUrl . '","' . $this->mypost->nickName . '","' . time() . '", "' . $this->from . '") ON DUPLICATE KEY UPDATE avatarUrl="' . $this->mypost->avatarUrl . '",nickName="' . $this->mypost->nickName . '", ad="' . $this->mypost->ad . '",wechat="' . $this->mypost->wechat . '",douyin="' . $this->mypost->douyin . '",weibo="' . $this->mypost->weibo . '", belong="' . $this->from . '"';
		$res = $this->db->dql($sql);

		$this->sendData($res, $sql);
	}

	// 管理员更新用户信息
	public function adminEditUser() {

		$sql = 'insert into user(openid,avatarUrl,nickName,college,createtime) value("' . $this->mypost->openid . '","' . $this->mypost->avatarUrl . '","' . $this->mypost->nickName . '","' . $this->mypost->college . '","' . time() * 1000 . '") ON DUPLICATE KEY UPDATE avatarUrl="' . $this->mypost->avatarUrl . '",nickName="' . $this->mypost->nickName . '", college="' . $this->mypost->college . '", belong="' . $this->from . '"';
		$res = $this->db->dql($sql);

		$this->sendData($res);
	}
    

    // 根据关键词获取用户列表
	public function getUserList() {
		$sql = "select * from user where nickName like '%" . $this->mypost->keyword . "%'";
		$res = $this->db->dql($sql);
		$this->sendData(mysqli_fetch_all($res,MYSQLI_ASSOC));
	}

	// 获取列表数据

	// 用户发布
	// 用户发布信息需要做一次安全检查
	// 微信这里的检查，内容字段必须有值，如果用户只发不图片，就跳过微信的内容检查
	public function push() {
	   $rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
	   $mypost = json_decode($rws_post);
       
       // 内容不是空，则进行安全检查
       if($mypost->cont != '') {
	       $http = new http();
	       $jssdk = new wxlittle();
	       $url = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='.$jssdk->getAccessToken();
	       $content = array(
	       	 'content' => $mypost->cont
	       	);
	       $check = $http->httpsPost($url, $content);
	       if(json_decode($check)->errmsg != 'ok') {
	       	 $this->sendError('内容违规，请检查后再发送', $check);
	       	 exit(0);
	       }
	   }

		if (!isset($mypost->belong)) {
			$mypost->belong = 'unibbs';
		}

		$data = array();
		$id = '';
		if (isset($mypost->id)) {
			$data['id'] = $mypost->id;
			$sql = "UPDATE ershou set title='" . $mypost->title . "',cont='" . $mypost->cont . "',imgs='" . serialize($mypost->imgs) . "',imgs_detail='" . serialize($mypost->imgs_detail) . "',symbol='" . $mypost->symbol . "',updatetime='" . time() . "',college='" . $mypost->college . "',address='" . $mypost->address . "',openid='" . $mypost->openid . "',wechat='" . $mypost->wechat . "',price='" . $mypost->price . "',old_price='" . $mypost->old_price . "',is_new='" . $mypost->is_new . "',level='" . $mypost->level . "',classify='" . $mypost->classify . "',category='" . $mypost->category . "',status='" . $mypost->status . "', updatetime='" . time() . "' where id='" . $mypost->id . "'";
			$data['msg'] = '更新成功';
		} else {
			$sql = "INSERT into ershou(openid,title,cont,imgs,imgs_detail,symbol,college,address,wechat,price,classify,category,createtime,updatetime, belong) value('" . $mypost->openid . "','" . $mypost->title . "','" . $mypost->cont . "','" . serialize($mypost->imgs) . "','" . serialize($mypost->imgs_detail) . "','" . $mypost->symbol . "','" . $mypost->college . "','" . $mypost->address . "','" . $mypost->wechat . "','" . $mypost->price . "','" . $mypost->classify . "','" . $mypost->category . "','" . time() . "','" . time() . "', '" . $mypost->belong . "')";
			$data['msg'] = '发布成功';
		}
		$res = $this->db->dql($sql);
		$data['code'] = 200;

		if ($res) {
			if (!isset($mypost->id)) {
				$sql = 'select LAST_INSERT_ID()';
				$res = $this->db->dql($sql);
				$data['id'] = mysqli_fetch_assoc($res)['LAST_INSERT_ID()'];
			}

		} else {
			$data['code'] = 201;
			$data['msg'] = 'sql异常';
		}

		// // update college set num = (select count(*) from ershou where college='北京大学') where uName="北京大学"
		// $sql = 'update college set num = (select count(*) from ershou where college="' . $mypost->college . '") where uName="' . $mypost->college . '" ';
		// $db->dql($sql);
		$this->sendData($data, $sql);
	}

	// 更改帖子状态
	public function editStatus() {
		$sql = "update ershou set status='0' where id='" . $this->mypost->id . "'";
		$res = $this->db->dql($sql);
		$this->sendData($res, $sql);
	}

	// 用户可以点赞和取消点赞
	public function userLike() {

		// 先查询出用户对该主题最近一次的点赞记录
		$sql = "select id,status from liked where openid='" . $this->mypost->openid . "' and mainid='" . $this->mypost->id . "' order by createtime desc limit 1";
		$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
		$status = '1'; // 默认
		if ($res && $res['status'] == '1') {
			$status = '0';
			$sql = "update ershou set liked = liked-1 where id='" . $this->mypost->id . "'";
			$this->db->dql($sql);
		} else {
			$sql = "update ershou set liked = liked+1 where id='" . $this->mypost->id . "'";
			$this->db->dql($sql);
		}

		$sql = "insert into liked(openid,mainid,status,createtime) value('" . $this->mypost->openid . "','" . $this->mypost->id . "','" . $status . "','" . time() . "') ";
		$r2 = $this->db->dql($sql);

		$data['res'] = $r2;
		$data['sql'] = $sql;
		$data['status'] = $status;
		echo json_encode($data);
	}

	// 用户评论
	public function userComment() {

		$sql = "insert into comment(openid, main_id, order_id, content, imgs, status, createtime) value('" . $this->mypost->openid . "','" . $this->mypost->main_id . "','" . $this->mypost->order_id . "','" . $this->mypost->content . "','" . serialize($this->mypost->imgs) . "','1','" . time() . "') ";
		$res = $this->db->dql($sql);
		$this->sendData($res, $sql);
	}

	// 更改分类信息
	public function editType() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = '';
		if (isset($mypost->id)) {
			$sql = "update classify set name='" . $mypost->name . "', subCategory = '" . serialize($mypost->subCategory) . "',status='" . $mypost->status . "',is_show='" . $mypost->is_show . "' where id='" . $mypost->id . "'";

		} else {
			$sql = "insert into classify(name,subCategory,is_show,belong) value('" . $mypost->name . "','" . serialize($mypost->subCategory) . "','" . $mypost->is_show . "','" . $mypost->belong . "')";
		}
		$res = $this->db->dql($sql);

		$this->sendData($res, $sql);
	}

	// 编辑分类
	public function getTypeList() {
		$sql = "select * from classify where status!='0' and belong='unibbs'";

		if (isset($this->mypost->belong)) {
			$sql = "select * from classify where status!='0' and belong='" . $this->mypost->belong . "'";
		}

		$res = $this->db->dql($sql);
		$data = array();
		while ($row = $res->fetch_assoc()) {
			$row['subCategory'] = unserialize($row['subCategory']);
			array_push($data, $row);
		}
        
        $this->sendData($data);

	}

	public function getClassify() {
		$sql = "select * from classify where status!='0' and belong='unibbs'";

		if (isset($this->mypost->belong)) {
			$sql = "select * from classify where status!='0' and belong='" . $this->mypost->belong . "'";
		}

		$res = $this->db->dql($sql);
		$data = array();
		while ($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			if (unserialize($row['subCategory'])) {
				$row['subCategory'] = unserialize($row['subCategory']);
			} else {
				$row['subCategory'] = array();
			}

			array_push($data, $row);
		}
		$this->sendData($data, $sql);
	}

	// 用户登录
	public function login() {
		$sql = 'select * from user where account="' . $this->mypost->username . '" and pwd="' . $this->mypost->password . '" and belong="' . $this->mypost->belong . '" limit 1';
        $res = $this->db->dql($sql)->fetch_object(); 
		$this->sendData($res);
	}

	public function throwError() {
		throw new Exception('openid已经存在', '0');
	}

	// 参数1：sql执行成功还是失败
	public function sendData($res, $sql = '') {
		$data['res'] = $res;
		$data['sql'] = $sql;
		$data['data'] = $res;
		$data['code'] = 200;
		echo json_encode($data);
	}
    
    // 程序发生错误
	public function sendError($reason, $source) {
		$data['data'] = $reason;
		$data['code'] = 201;
		$data['source'] = $source;
		echo json_encode($data);
	}

	// 类私有函数，检查用户是否已经存在，私有方法
	private function _check() {

	}


	// 获取学校最新通知
    // https://packagist.org/packages/jaeger/querylist#V3.2.1
	// public function getCollegeNotice() {
 //        $college = $this->mypost->college;
	// 	$rules = array(
	// 	    //采集id为one这个元素里面的纯文本内容
	// 	    'text' => array('#line_u10_0>>a>span','text'),
	// 	    //采集class为two下面的超链接的链接
	// 	    'link' => array('#line_u10_0>a','href')
	// 	);
	// 	$url = 'http://www.xisu.edu.cn/tzgg/ggtz.htm';
	// 	$data = QueryList::Query($url,$rules)->data;
        
 //        // id用来防止插入重复的学校通知
 //        $id = str_replace("..","", $data[0]['link']);

 //        $url_detail = 'http://www.xisu.edu.cn' . $id;
 //        $contArr = $this->getCollegeNoticeDetail($url_detail);

 //        $belong = $college . '-notice-' . str_replace("/","-",$id);
 //        $openid = 'ok-v05fVE9BEw4-nBL2Ma5hmGRE4';
 //        $cont = '';
	// 	foreach ($contArr as $v) {
	// 	   $cont = $cont . '\n' . $v['text'];
	// 	}

 //        $sql_cont = "INSERT INTO ershou(openid, cont, college, belong,updatetime) select '".$openid."','".$cont."','".$college."','".$belong."','".time()."' from DUAL where not exists (select id from ershou where belong='".$belong."')";
 //        $is_insert = $this->db->dql($sql_cont);
 //        // if ($is_insert) {
	//         // 返回自增的id
 //        $sql = 'SELECT LAST_INSERT_ID()';
 //        $res=mysql_fetch_array($this->db->dql($sql),MYSQL_ASSOC);

 //        if ($res['LAST_INSERT_ID()'] == "0") {
	//     	$sql = "SELECT id from ershou where belong='".$belong."' ";
	//     	$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
	//     	$data[0]['id'] = $res['id'];
 //        } else {
 //        	$data[0]['id'] = $res['LAST_INSERT_ID()'];
 //        }


	//     // } else {
	//     // 	$sql = "SELECT id from ershou where belong='".$belong."' ";
	//     // 	$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
	//     // 	$data[0]['id'] = $res['id'];
	//     // }

	// 	$this->sendData($data[0],$is_insert);
		
	// }
    
    // 获取学校通知详情
	public function getCollegeNotice(){
		$sql = 'select * from ershou where college="'.$this->mypost->college.'" and classify="学校通知" order by createtime desc limit 1';
		$res = $this->db->dql($sql)->fetch_object();
		$this->sendData($res);
	}

	//c=CET&ik=610171192115310&t=29705
	public function getEnglishTestCode() {
        $url = "http://cache.neea.edu.cn/Imgs.do?c=CET&ik=".$this->mypost->ik."&t=".$this->mypost->t;
        $header = array(
        	'Host: cache.neea.edu.cn','Referer: http://cet.neea.edu.cn/cet'
        );
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, true); // 只有它为true，才会返回相应头
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36');
		curl_setopt($ch, CURLOPT_TIMEOUT, 15);
		$res = curl_exec($ch);
		list($header, $body) = explode("\r\n\r\n", $res);
		$headers = explode("\r\n", $header); 
		// var_dump($headers[3]);
		$cookie = explode(": ", $headers[3]); 
		// var_dump($cookie[1]);
		$data['res'] = $body;
		$data['cookie'] = $cookie[1];
        $data['url'] = $url;
		curl_close($ch);
        $this->sendData($data);
	}
    
    // 获取成绩
    // query_url = "http://cache.neea.edu.cn/cet/query?"
    // test = {
    //     '1': 'CET4_192_DANGCI',
    //     '2': 'CET6_181_DANGCI',
    //     '3': 'CET4_192_DANGCI'
    // }
    // data = {
    //     'data': test.get(level) + ',' + id_num + ',' + name,
    //     'v': capcha
    // }
	public function getEnglishScore() {
		$level = $this->mypost->zkzh[9];

	    $test = array(
	        '1' => 'CET4_192_DANGCI',
	        '2' => 'CET6_192_DANGCI'
	    );

		$data = array(
	        'data' => $test[$level] . ',' . $this->mypost->zkzh . ',' . $this->mypost->xm,
	        'v' => 	$this->mypost->yzm		
		);
        
		// echo http_build_query($data);
        $url = "http://cache.neea.edu.cn/cet/query?".http_build_query( $data );
        $header = array(
        	'Host: cache.neea.edu.cn','Referer: http://cet.neea.edu.cn/cet'
        );
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0); // 只有它为true，才会返回相应头
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36');
		curl_setopt($ch, CURLOPT_TIMEOUT, 15);
		curl_setopt($ch, CURLOPT_COOKIE, $this->mypost->cookie);
		$res = curl_exec($ch);
		curl_close($ch);
        $this->sendData($res, $url);
	}

	public function getResponseHeader($header) {
	  foreach ($response as $key => $r) {
	     if (stripos($r, $header) !== FALSE) {
	        list($headername, $headervalue) = explode(":", $r, 2);
	        return trim($headervalue);
	     }
	  }
	}
    
    // 获取每个帖子下面的评论
	public function getMessageByDetail(){
		$sql = 'select m.id,m.fromopenid,m.cont,m.tag,m.createtime,m.status,u.avatarUrl,u.nickName  from message m left join user u on u.openid = m.fromopenid where  m.ershou="' . $this->mypost->id . '" order by m.createtime ';
		$res = $this->db->dql($sql);
		$this->sendData(mysqli_fetch_all($res,MYSQLI_ASSOC));
	}

	// 发布评论
	public function pushComment(){
        $http = new http();
        $jssdk = new wxlittle();
        $url = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='.$jssdk->getAccessToken();
        $content = array(
       	   'content' => $this->mypost->cont
       	);
        $check = $http->httpsPost($url, $content);
        if(json_decode($check)->errmsg != 'ok') {
	       	$this->sendError('内容违规，请检查后再发送', $check);
	       	exit(0);
        }		
        
		$sql = 'INSERT into message(ershou,toopenid,fromopenid,cont,tag,createtime) value("' . $this->mypost->id . '","' . $this->mypost->toopenid . '","' . $this->mypost->fromopenid . '","' . $this->mypost->cont . '","' . $this->mypost->tag . '","' . time() . '")';
		$result = $this->db->dql($sql);
		$res = $this->db->dql('SELECT LAST_INSERT_ID() as id');
		$send = $this->pushAfterMessgae();
        $this->sendData($res, $send);
	}

	// 发布评论后通知发帖人
	public function pushAfterMessgae(){
		$jssdk = new wxlittle();
		$data['touser'] = $this->mypost->toopenid;
		$data['template_id'] = "dgp1OjAIjfz2mr9PbLJ5U2vU4edvkLO0uXpjJhSfAy4";
		$data['page'] = "pages/date/detail/index?id=" . $this->mypost->id;
		$data['data'] = array(
			'thing1' => array('value' => $this->mypost->name),
			'thing2' => array('value' => $this->mypost->cont),
		);
		return $jssdk->push($data);
	}
    
    // 获取小程序token
	public function getAccessToken(){
		$jssdk = new wxlittle();
		echo $jssdk->getAccessToken();
	}
    
    // 通过关键词搜索大学
	public function searchCollege(){
		$sql = "select * from college where uName like '%" . $this->mypost->name . "%'";
		$res = $this->db->dql($sql);
		$this->sendData(mysqli_fetch_all($res,MYSQLI_ASSOC));
	}
    
    // 获取学校详细信息
	public function  getCollegeById(){
		$sql = 'select * from college where sid ="' . $this->mypost->id . '"';
		$res = $this->db->dql($sql)->fetch_object(); 
		$this->sendData($res);
	}
    
    // 编辑学校信息
    public function editCollege(){
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$mypost = json_decode($rws_post);
		$sql = '';
		if (isset($mypost->sid)) {
			$sql = 'update college  set uName="' . $mypost->uName . '",top_img="' . $mypost->top_img . '",logo="' . $mypost->logo . '", tieba_spider="'.$mypost->tieba_spider.'" where sid="' . $mypost->sid . '"';
		} else {
			$sql = 'insert into college(uName,top_img,logo) value("' . $mypost->uName . '","' . $mypost->top_img . '","' . $mypost->logo . '")';
		}

		$res = $this->db->dql($sql);
		$this->sendData($res);
	}
    
    // 保存用户查询的四六级成绩
	public function saveScore() {
		$sql = 'INSERT into cet(zkzh,xm,college,id_number,s,l,r,w,kys,kyz) value("' . $this->mypost->zkzh . '","' . $this->mypost->xm . '","' . $this->mypost->college . '","' . $this->mypost->id_number . '", "' . $this->mypost->s . '","'.$this->mypost->l.'","'.$this->mypost->r.'","'.$this->mypost->w.'","'.$this->mypost->kys.'","'.$this->mypost->kyz.'") ON DUPLICATE KEY UPDATE zkzh="' . $this->mypost->zkzh . '"';
		$res = $this->db->dql($sql);

		$this->sendData($res, $sql);        
	}
    
    // 获取我的CET考试成绩证书
	public function getCetCard() {
	    $shell = "sudo sh /home/wwwroot/default/spider/english/run.sh " . $this->mypost->zkzh . " 2>&1";
		$res = shell_exec($shell);
	    $this->sendData($res);
	}

    // 获取教师资格证的验证码
	public function getTeacherCode() {
        $url = "http://search.neea.edu.cn/Imgs.do?act=verify&t=". mt_rand(1,999999);
        $header = array(
        	'Host: search.neea.edu.cn',
        	'Referer: http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryCond&pram=results&community=Home&sid=2nasVMoohJ6cFnsQEIjGYmh'
        );
        $http = new http();
        $res = $http->httpGet($url, $header);
        list($header, $body) = explode("\r\n\r\n", $res);
        $headers = explode("\r\n", $header); 
		$cookie = explode(": ", $headers[8]); 
        // 这里利用身份证号码来区分每个人的验证码
        $name = 'unibbs_teacher_code_'.$this->mypost->zjhm.'.jpeg';
        $data['res'] = 'https://examlab.cn/uniapi/upload/'.$name;
        $data['cookie'] = $cookie[1];

        $file = __ROOT__.'/upload/'.$name;
        $tp = @fopen($file, 'w');
        $fw = fwrite($tp, $body);
        fclose($tp);

        if($fw) {
          $data['msg'] = 'ok';
        } else {
          $data['msg'] = '验证码保存失败';
        }
        $this->sendData($data);
	}

	// 获取教师资格证的成绩
	public function getTeacherScore() {
        $url = 'http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryNtceResultsList';
        
        // post测试用例不要删除
		// $data = array(
	 //      'zjhm' => '141031199203030013', // 身份证号码
	 //      'xm' => '任', // 姓名 
	 //      'ksxm' => '2nasVMoohJ6cFnsQEIjGYmh', // 固定值
	 //      'pram' => 'results', // 固定值
	 //      'verify' => 'e52d' // 验证码
		// );
		$data = $this->mypost;
        $header = array(
        	'Referer: http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryCond&pram=results&community=Home&sid=2nasVMoohJ6cFnsQEIjGYmh'
        );
        $cookie = $this->mypost->cookie;
        // cookie测试用例不要删除
        // $cookie = 'verify=enc|e6c82c2149bc6eb7c9d474a48aee9351fb5925a7a069c9d30335af557cd04f26; domain=.neea.edu.cn; max-age=1800; path=/; httponly';

        // session不确定是否需要
        $sessionid = "esessionid=DCFFABB95ADA522A2D8F7246F6403A4C";
        $http = new http();
        $res = $http->httpPost($url,$data,$header,$cookie);
		$html = HtmlDomParser::str_get_html( $res );
      
		$arr = [];
		$map = ['科目', '报告分', '合格与否','准考证号','考试批次','有效期限','考试省份','科目', '合格与否', '准考证号', '考试批次', '考试省份'];
		$index = 0;
		foreach($html->find('tr[height=25] td') as $element) {
		   $item = array(
		   	 'name' => $map[$index],
		   	 'value' => $element->innertext
		   );
           array_push($arr, $item);
           $index++;
		}
        if(count($arr)) {
        	$sd['msg'] = 'ok';
        	$sd['res'] = $arr;
        	$this->sendData($sd);
        } else {
        	// 如果是验证码错误，直接提取括号中的内容
        	$re = [];
        	$sd = [];
        	preg_match_all("/(?:\()(.*)(?:\))/i",$res, $re);

            // 如果是姓名或者证件号码不对，会提示查询不到
            $error = $html->find('div.he_xi', 0)->plaintext;
            
            if($re[1][0] == "") {
            	$sd['msg'] = $error;
            } else {
            	$sd['msg'] = $re[1][0];
            }
            $sd['res'] = $arr;
        	$this->sendData($sd);
        }
		
	}

	// 获取普通话等级考试成绩
	public function getLanguageScore() {
        $url = 'http://www.cltt.org/StudentScore/ScoreResult';
		$header = array('Content-Type: application/x-www-form-urlencoded');
        $http = new http();
   //      $data = [
			// 'idCard' => '141031199203030013',
			// 'name' => '任建龙'
   //      ];
        $res = $http->httpPost($url, http_build_query($this->mypost), $header);
		$html = HtmlDomParser::str_get_html( $res );
        $error = $html->find('h2.txtcenter', 0)->plaintext;

        if ($error == "普通话水平测试查询结果") {
			$avatar = $html->find('img', 0)->src;
			$map = ['照片','姓名', '分数', '性别','等级','准考证号','证书编号','身份证号'];
			$index = 0;
			$arr = [];
		    foreach($html->find('td span') as $element) {
			    $item = array(
			   	 'name' => $map[$index],
			   	 'value' => $element->innertext
			    );
	            array_push($arr, $item);
			    $index++;
			}
			$arr[0]['value'] = $avatar;
			$arr[0]['value_type'] = 'img';
			$sd['res'] = $arr;
			$sd['msg'] = 'ok';
			$this->sendData($sd);
		} else {
			$sd['res'] = [];
			$sd['msg'] = $error;
			$this->sendData($sd);			
		}
	}
    
    // 获取带有帖子id的小程序二维码
	public function getShareImg() {
	    $shell = "sudo sh /home/wwwroot/default/spider/unibbs/run.sh " . $this->mypost->id . " 2>&1";
		$res = shell_exec($shell);
	    $this->sendData($res);
	}

	// 获取我的消息
	// 获取我的消息
    public function getMyMessage(){
		$sql = 'select m.id,m.ershou,m.fromopenid,m.cont,m.tag,m.createtime,m.status,u.avatarUrl,u.nickName  from message m left join user u on u.openid = m.fromopenid where m.toopenid="' . $this->mypost->openid . '" and m.fromopenid!="' . $this->mypost->openid  . '" order by m.createtime desc ';
		$res = $this->db->dql($sql);
		$this->sendData(mysqli_fetch_all($res,MYSQLI_ASSOC));
	}

	public function updateMessageStatus() {
		$sql = 'update message set status = "'.$this->mypost->status.'" where id="' . $this->mypost->id . '" ';
		$res = $this->db->dql($sql);
		$this->sendData($res);	
	}

	// 登陆学信网
	// 打开首页，获取cookie、
	public function getChsiHome() {
		$data = array();
        // $url = 'https://account.chsi.com.cn/passport/login';
        $url = 'https://account.chsi.com.cn/passport/login?entrytype=yzgr&service=https%3A%2F%2Fyz.chsi.com.cn%2Fj_spring_cas_security_check';
   	    $headers = [
	        'Host: account.chsi.com.cn',
			'Origin: https://account.chsi.com.cn',
			'Referer: https://account.chsi.com.cn/passport/login?entrytype=yzgr&service=https%3A%2F%2Fyz.chsi.com.cn%2Fj_spring_cas_security_check'
	    ];
	    $client = new Client();
        $response = $client->get($url);
        // var_dump($response);
        $cookie = $response->getHeader('Set-Cookie');
        // 先把请求下发的cookie拿出来
        $data['Cookie'] = implode(';', $cookie);	
        
        // 接着把表单中隐藏的lt和execution也能拿出来
        $body = $response->getBody()->getContents();
        $html = HtmlDomParser::str_get_html( $body );
        // var_dump($html);
        foreach($html->find('form[id=fm1], input[type=hidden]') as $element) {
       	 if ($element->name == 'lt') {
       	 	$data['lt'] = $element->value;
       	 }
       	 if ($element->name == 'execution') {
       	 	$data['execution'] = $element->value;
       	 }
        }

        $data['headers'] = $headers;
        return $data;
	}
    
    // 获取大学教务系统验证码，每个大学都是调用这个函数
    // 函数内部调用对应的大学脚本
	public function getCollegeSystemCode() {
		$college = $this->mypost->college;
        // 加载指定大学的类文件
   	    include __ROOT__ .'/'. $this->mapCollege[$college] . '.php';
		$college = new $this->mapCollege[$college]();
		$college->getCode();
	}
    
    // 教务系统登陆
	public function collegeSystemLogin() {
		$college = $this->mypost->college;
	  //   $post = array(
	  //       'cookie' => "ASP.NET_SessionId=jt5dfcvpigkarmq0gskx0li2; path=/",
			// 'password' => "199703152741",
			// 'username' => "2016010363",
			// 'yzm' => "dqdt"
   //      );
		$data = array(
	        'cookie' => $this->mypost->cookie,
			'password' => $this->mypost->password,
			'username' => $this->mypost->username,
			'yzm' => $this->mypost->yzm,
			'college' => 	$this->mypost->college,	
		);
        // 加载指定大学的类文件
   	    include __ROOT__ .'/'. $this->mapCollege[$college] . '.php';
		$college = new $this->mapCollege[$college]();
		$college->userLogin($data);
	}
    
    // 获取成绩
	public function getCollegeExamScore() {
		$college = $this->mypost->college;
	    $data = array(
	    	'cookie' => $this->mypost->cookie,
	    	'xn' => $this->mypost->xn,
	    	'username' => $this->mypost->username
	    );
        // 加载指定大学的类文件
   	    include __ROOT__ .'/'. $this->mapCollege[$college] . '.php';
		$college = new $this->mapCollege[$college]();
		$college->getScore($data);
	}

	// 获取学信网的图片验证码
	// 获取验证码时，它就会携带本地的cookie
	// response直接返回一个验证码，登陆时携带次验证码
	// 因为服务器端在生成验证码时就是根据提交的cookie生成的
	// 如果当客户端携带验证码来的时候，它就判断一下验证码和cookie是否符合
	public function getChsiCode() {
	    // $data = $this->getChsiHome();
	 //    $data['headers']['Accept'] = 'image/webp,image/apng,image/*,*/*;q=0.8';
  //       $url = "https://account.chsi.com.cn/passport/captcha.image?id=". mt_rand(100000,999999);
        
  //       $client = new Client();
  //       $response = $client->request('GET', $url, [
  //           'headers' => $data['headers']
		// ]);
        
  //       // 把验证码保留在服务器上
  //       $body = $response->getBody(); 
  //       $name = 'unibbs_chis_code_test.jpeg';
  //       $file = __ROOT__.'/upload/'.$name;
  //       $tp = @fopen($file, 'w');
  //       $fw = fwrite($tp, $body);
  //       fclose($tp);

  //       if($fw) {
  //         $data['msg'] = 'ok';
  //       } else {
  //         $data['msg'] = '验证码保存失败';
  //       }
  //       $data['Set-Cookie'] = $response->getHeader('Set-Cookie');
  //       $data['Cookie'] = implode(';', $data['Set-Cookie']);
  //       $data['res'] = 'https://examlab.cn/uniapi/upload/'.$name;
        
  //       // 把data保存在txt文件中
        // $cookie_name = 'unibbs_chis_cookie.txt';
        // $file = __ROOT__.'/upload/'.$cookie_name;
        // $tp = @fopen($file, 'w');
        // $fw = fwrite($tp, serialize($data));
        // fclose($tp);

        // print_r($data);
	}

	public function getChsiScore() {
		// $cookie_name = 'unibbs_chis_cookie.txt';
  //       $file = __ROOT__.'/upload/'.$cookie_name;
	 //    $handle = fopen($file, "r");//读取二进制文件时，需要将第二个参数设置成'rb'
	    
	 //    //通过filesize获得文件大小，将整个文件一下子读到一个字符串中
	 //    $contents = fread($handle, filesize ($file));
	 //    $data = unserialize($contents);
	 //    fclose($handle);

  //       // $url = 'https://account.chsi.com.cn/passport/login';
  //       $url = 'https://account.chsi.com.cn/passport/login?entrytype=yzgr&service=https%3A%2F%2Fyz.chsi.com.cn%2Fj_spring_cas_security_check';
  //       $client = new Client();

	 //    $form_params = array(
	 //    	// 'captcha' => '2sMmfy',
	 //    	'execution' => $data['execution'],
	 //    	'lt' => $data['lt'],
	 //    	'password' => 'q448411098',
		// 	'submit' => '登  录',
		// 	'username' => '18291934412',
		// 	'_eventId' => 'submit',
	 //    );
	 //    var_dump($form_params);
  //  	    $httpheader = [
	 //  //       'Host: account.chsi.com.cn',
		// 	// 'Origin: https://account.chsi.com.cn',
		// 	// 'Referer: https://account.chsi.com.cn/passport/login',
		// 	'Content-Type: application/x-www-form-urlencoded'
	 //    ];
	 //    $http = new http();

	 //    // var_dump($data);
	 //    $res = $http->httpPost($url, http_build_query($form_params), $httpheader, $data['Cookie']);
	 //    // $res = $http->httpPost($url, $form_params, $httpheader, $data['Cookie']);
	 //    var_dump($res);

  //       // var_dump($loginResponse);
  //       $loginBody = $loginResponse->getBody()->getContents();
  //       // var_dump($loginBody);
  //       var_dump($loginBody);     
	}

	/** 
	 * 对象数组转为普通数组 
	 * 
	 * AJAX提交到后台的JSON字串经decode解码后为一个对象数组， 
	 * 为此必须转为普通数组后才能进行后续处理， 
	 * 此函数支持多维数组处理。 
	 * 
	 * @param array 
	 * @return array 
	 */  
	// public function objarray_to_array($obj) {  
	//     $ret = array();  
	//     foreach ($obj as $key => $value) {  
	//     if (gettype($value) == "array" || gettype($value) == "object"){  
	//             $ret[$key] = $this->objarray_to_array($value);  
	//     }else{  
	//         $ret[$key] = $value;  
	//     }  
	//     }  
	//     return $ret;  
	// } 

	// https://account.chsi.com.cn/account/account!show.action
	// 直接拷贝在网页上登陆的cookie，不使用header，都可以成功请求到个人中心的信息
	// public function getChsiUserCenter() {
 //        $url = 'https://account.chsi.com.cn/account/account!show.action';
 //   	    $headers = [];
 //        $cookie = 'CHSICC_CLIENTFLAG4=8ed5169d2c6fdf932a7b2c9b449812f4; JSESSIONID=7A9DF12EAEB7B0C963644A58CDCA1ACD; aliyungf_tc=AQAAAJrXMVCm/gIAdSL43hyE/CSMTkHG; acw_tc=2760827615846746802084448e4c289073deb071d8f37a27096bc9f4f4bdf2; __utmc=39553075; CHSICC01=!bbeGj9DqLohOBY4GGYWrKFjgWJfD/8vMdCsoXh4OTatYF2qbGbOstRZDY5ihqFEpbykM74tkEmwoftM=; _ga=GA1.4.116634055.1584427062; _ga=GA1.3.64681067.1585065632; zg_did=%7B%22did%22%3A%20%221710d46a43c4f7-0034da2582915b-396a7407-13c680-1710d46a43db1e%22%7D; zg_0d76434d9bb94abfaa16e1d5a3d82b52=%7B%22sid%22%3A%201585141914958%2C%22updated%22%3A%201585141914961%2C%22info%22%3A%201585135105160%2C%22superProperty%22%3A%20%22%7B%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22www.ycu.edu.cn%22%2C%22landHref%22%3A%20%22https%3A%2F%2Fmy.chsi.com.cn%2Farchive%2Findex.jsp%22%7D; __utmz=39553075.1585142945.5.5.utmcsr=yz.chsi.com.cn|utmccn=(referral)|utmcmd=referral|utmcct=/yzwb/; zg_adfb574f9c54457db21741353c3b0aa7=%7B%22sid%22%3A%201585142942977%2C%22updated%22%3A%201585142954571%2C%22info%22%3A%201585065665605%2C%22superProperty%22%3A%20%22%7B%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22yz.chsi.com.cn%22%2C%22cuid%22%3A%20%22e4a0aeed3d05cfa55e092f44e72823b6%22%7D; _gid=GA1.4.968483644.1585318530; __utma=39553075.116634055.1584427062.1585358521.1585368746.12; __utmt=1; __utmb=39553075.1.10.1585368746';
 //        $http = new http();
 //        $res = $http->httpGet($url, $headers, $cookie);
 //        var_dump($res);
	// }

}