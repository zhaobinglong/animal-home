<?php

header("Content-type: text/html; charset=utf-8");

include 'http.class.php';
require '../core/common/goods_redis.php';

class user {
	private $appId;
	private $appSecret;
	public $log;
	public $http;
	public $token;
	public $db;
	public $from;
	public $valid_college;

	public function __construct($db) {
		$this->db = $db;
		$this->appId = 'wxbeb454d1e270db32';
		$this->appSecret = '17bd477b669a9b976c450930fbddc46d';
		$this->token = 'unigoods';
		$this->log = '/home/wwwroot/default/tmp/unibbs.log';
		$this->http = new http();
		$this->from = 'unibbs-server';
		$this->valid_college = array('西北政法大学'); //可绑定的学校
	}

	// 字符串验证
	private function checkSignature() {
		$signature = $_GET["signature"];
		$timestamp = $_GET["timestamp"];
		$nonce = $_GET["nonce"];

		// 使用构造函数中定义的token
		$token = $this->token;
		$tmpArr = array($token, $timestamp, $nonce);
		sort($tmpArr);
		$tmpStr = implode($tmpArr);
		$tmpStr = sha1($tmpStr);

		if ($tmpStr == $signature) {
			return true;
		} else {
			return false;
		}
	}

	// 获取签名字符串
	public function getSignPackage($url) {
		$jsapiTicket = $this->getJsApiTicket();
		// $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		$timestamp = time();
		$nonceStr = $this->createNonceStr();

		// 这里参数的顺序要按照 key 值 ASCII 码升序排序
		$string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

		$signature = sha1($string);

		$signPackage = array(
			"appId" => $this->appId,
			"nonceStr" => $nonceStr,
			"timestamp" => $timestamp,
			"url" => $url,
			"signature" => $signature,
			"rawString" => $string,
		);
		return json_encode($signPackage);
	}

	// 生成随机字符串
	private function createNonceStr($length = 16) {
		$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$str = "";
		for ($i = 0; $i < $length; $i++) {
			$str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
		}
		return $str;
	}

	//获取调用jsapi需要的ticket
	public function getJsApiTicket() {
		// jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
		$data = json_decode(file_get_contents("jsapi_ticket.json"));
		// var_dump($data);
		if (!$data || $data->expire_time < time()) {
			$accessToken = $this->getAccessToken();
			$url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=" . $accessToken;
			$res = json_decode($this->http->httpGet($url));
			$ticket = $res->ticket;
			if ($ticket) {
				$data->expire_time = time() + 7000;
				$data->jsapi_ticket = $ticket;
				$fp = fopen("jsapi_ticket.json", "w");
				fwrite($fp, json_encode($data));
				fclose($fp);
			}
		} else {
			$ticket = $data->jsapi_ticket;
		}

		return $ticket;
	}

	// 获取服务器端保存的access_token
	// __DIR__代表当前文件本文件所在的目录
	// 在保存进入静态文件保存时，必须json_encode转码
	public function getAccessToken() {
		$path = __DIR__ . "/access_token.json";
		$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" . $this->appId . "&secret=" . $this->appSecret;
		$string = file_get_contents($path);
		$data = json_decode($string);
		if ($data) {
			if ($data->expire_time < time()) {
				$res = $this->http->httpGet($url);
				$this->setLog($url);
				$this->setLog($res);
				$res = json_decode($res);
				$access_token = $res->access_token;
				// 这里必须使用绝对路径，否则在ubuntu中读取不到
				$fp = fopen($path, "w");
				$obj = array(
					'expire_time' => time() + 7000,
					'access_token' => $access_token,
				);
				$end = fwrite($fp, json_encode($obj));
				fclose($fp);
				return $access_token;
			} else {
				return $data->access_token;
			}
		} else {

			$res = $this->http->httpGet($url);
			$res = json_decode($res);
			$access_token = $res->access_token;
			// 这里必须使用绝对路径，否则在ubuntu中读取不到
			$fp = fopen($path, "w");
			$obj = array(
				'expire_time' => time() + 7000,
				'access_token' => $access_token,
			);
			$end = fwrite($fp, json_encode($obj));
			fclose($fp);
			return $access_token;
		}
	}

	//  获取带参数的二维码的ticket，其实就是先用参数生成一个ticket，再用ticket换二维码
	public function getQrcodeTicket($token, $college) {
		$url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' . $token;
		$data = array(
			'action_name' => 'QR_LIMIT_STR_SCENE',
			'action_info' => array("scene" => array("scene_str" => $college)),
		);
		$res = $this->http->httpsPostNoCode($url, json_encode($data));
		return json_decode($res)->ticket;
	}

	// 生成公众号带大学名字的二维码
	public function createQrcode() {

		// header("Content-Type:image/png");
		// header("Accept-Ranges:bytes");

		$token = $this->getAccessToken();
		$ticket = $this->getQrcodeTicket($token, $_GET['college']);
		$url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' . $ticket;

		header("location:" . $url);

	}

	// 保存二维码到本地服务器上,二维码命令 openid@subject.jpg
	// public function download($url, $openid, $subject) {
	// 	$name = $openid . '@' . $subject;
	// 	$path = '../img/' . $name . '.jpg'; //文件路径和文件名

	// 	if (file_exists($path)) {
	// 		$this->log->info('下载二维码，但是已经存在，name=' . $name);
	// 		// $this->mergeImg($openid,$subject);
	// 	} else {
	// 		$s = file_get_contents($url);
	// 		$res = file_put_contents($path, $s);
	// 		// if($res){
	// 		//    $this->mergeImg($openid,$subject);
	// 		// }
	// 	}

	// }

	// 合成二维码和背景图片
	// $name是二维码
	// public function mergeImg($openid, $subject) {

	// 	// 如果文件已经存在，就不要合并了
	// 	if (file_exists('../img/'+$openid . '@' . $subject+'.png')) {
	// 		$this->log->info('合并的二维码存在，openid=' . $openid);
	// 		return false;
	// 	}

	// 	$QR = "../img/" . $openid . '@' . $subject . ".jpg"; //二维码
	// 	$bk = './img/share.jpg'; //背景图片  由系统指定

	// 	$QR = imagecreatefromstring(file_get_contents($QR)); //open picture source
	// 	$this->log->info('载入二维码成功');
	// 	$bk = imagecreatefromstring(file_get_contents($bk)); //open picture source
	// 	$this->log->info('载入背景成功');
	// 	$QR_width = 430;
	// 	$QR_height = 430;
	// 	imagecopyresampled($bk, $QR, 200, 600, 0, 0, 355, 355, $QR_width, $QR_height); // mixed picture
	// 	$result_png = $openid . '@' . $subject . ".png"; // file name
	// 	$file = '../img/' . $result_png;
	// 	$res = imagepng($bk, $file); //output picture
	// 	$this->log->info('合并结果：' . json_decode($res));
	// 	if ($res) {
	// 		$this->log->success('图片合并成功');
	// 	} else {
	// 		$this->log->error('图片合并失败');
	// 	}
	// }

	// 给公众号设置菜单
	public function setMenu() {
		$menu = '{
		      "button":[
		                  {
			                 "type":"click",
			                 "name":"查成绩",
                             "key":"MY_RECORD"
		                  },
		                  {
			                 "type":"miniprogram",
			                 "name":"我的大学",
			                 "url":"http://mp.weixin.qq.com",
			                 "appid":"wxb518954af3e70b39",
			                 "pagepath":"pages/date/index/index"
		                  },
		               ]
		 }';
		$url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" . $this->getAccessToken();
		$res = $this->http->httpsPostNoCode($url, $menu);
		var_dump($res);
	}

	// 回复一段文本消息
	public function responseText($text, $fromUsername, $toUsername) {
		$time = time();
		$textTpl = "<xml>
					  <ToUserName><![CDATA[%s]]></ToUserName>
					  <FromUserName><![CDATA[%s]]></FromUserName>
					  <CreateTime>%s</CreateTime>
					  <MsgType><![CDATA[text]]></MsgType>
					  <Content><![CDATA[%s]]></Content>
					</xml>";
		$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $text);
		return $resultStr;
	}

	// 通过code获取用户基本信息
	public function getBaseInfoByCode($code) {
		$url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . $this->appId . '&secret=' . $this->appSecret . '&code=' . $code . '&grant_type=authorization_code';
		$res = json_decode($this->http->httpGet($url));
		var_dump($res);
	}

	// 小程序获取openid
	public function getOpenid($jscode) {
		$url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' . $this->appId . '&secret=' . $this->appSecret . '&js_code=' . $_GET['code'] . '&grant_type=authorization_code';
		$res = $this->http->httpGet($url);
		echo $res;
		// $this->sendData($res, '', '200');
	}

	public function sendData($res, $sql = '', $code = '') {
		$data['data'] = $res;
		$data['code'] = $code;
		$data['sql'] = $sql;
		echo json_encode($data);
	}

	//微信模板消息接口
	// public function push($data) {
	// 	$url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' . $this->getAccessToken();
	// 	$this->log->info($data);
	// 	$res = $this->http->httpsPost($url, $data);
	// 	$this->log->info(' 微信推送结果：' . json_encode($res));
	// 	echo $res;
	// }

	// 微信服务器主动响应消息
	public function responseMsgByServer() {
		echo '';
	}

	// 微信服务器被动响应消息
	public function responseMsg() {

		// 接收微信推送的xml
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

		// xml有效
		if (!empty($postStr)) {

			// 将xml解析为一个对象
			$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);

			//判断事件类型
			$msgType = $postObj->MsgType;
			$fromUsername = $postObj->FromUserName;
			$toUsername = $postObj->ToUserName;
			$time = time();
			$this->setLog($postObj);
			// 消息分类
			switch ($msgType) {

			// 接收用户输入的文字消息
			case "text":
				$lock_key = sprintf('message_lock_%s', $postObj->MsgId);
				$redis = new GoodsRedis();
				$check = $redis->add_nx_lock($lock_key);
				if (empty($check)) {
					echo '';
					exit;
				}

				if ($postObj->Content == 'debug') {
					$text = "你的openid是：" . $fromUsername;
					echo $this->responseText($text, $fromUsername, $toUsername);
				} elseif ($postObj->Content == 'token') {
					$text = $this->getAccessToken();
					echo $this->responseText($text, $fromUsername, $toUsername);
				} elseif ($postObj->Content == 'shell') {
					$text = "cd  /home/wwwroot/default/spider/xian/xbzf/ && scrapy crawl xbzf -a username=123 -a password=123 -a openid=" . $fromUsername;
					echo $this->responseText($text, $fromUsername, $toUsername);
				} elseif ($postObj->Content == 'test') {
					$text = __DIR__ . '/core/common/goods_redis.php';
					echo $this->responseText($text, $fromUsername, $toUsername);
				} else {
					// 先判断Content中有没有“绑定”
					$bind = strstr($postObj->Content, "绑定", false);
					// 存在绑定
					if ($bind) {
						// 拿到大学名字，给用户绑定
						$college = str_replace('绑定', '', $bind);
						$valid = in_array($college, $this->valid_college);
						if ($valid) {
							$this->bindCollege($fromUsername, $college);
							$text = "你绑定了" . $college . "，请输入你教务系统账号+密码，例如：12345+89075123";
							echo $this->responseText($text, $fromUsername, $toUsername);
						} else {
							$text = "你的大学" . $college . "，尚未开查成绩功能，请耐心等待～";
							echo $this->responseText($text, $fromUsername, $toUsername);
						}

						exit;
					}

					// 判断用户师傅输入了账号密码
					$fromArr = explode("+", $postObj->Content);
					if (count($fromArr) == 2) {
						$text = "你的账号是：" . $fromArr[0] . ",你的密码是：" . $fromArr[1] . ",正在查询成绩，请稍等···";
						// 向用户发送账号密码的提示
						$this->selfSendMessage($fromUsername, $text);
						// 保存用户的教务账号跟密码
						$this->saveAccount($fromUsername, $fromArr[0], $fromArr[1]);
						$shell = "sudo sh /home/wwwroot/default/spider/scrapy.sh " . $fromArr[0] . " " . $fromArr[1] . " " . $fromUsername;
						shell_exec($shell);
						echo "";
						exit;
					} else {
						$text = "请先绑定你的大学，输入：绑定XXXX。例如：绑定北京大学";
						echo $this->responseText($text, $fromUsername, $toUsername);
					}
				}
				break;

			// 事件消息
			case "event":
				$this->setLog('进入event事件case');
				$key = $postObj->EventKey;
				// $lock_key = sprintf('click_lock_%s_', $fromUsername . $postObj->EventKey);
				// $this->setLog($lock_key);
				// $redis = new GoodsRedis();
				// $check = $redis->add_nx_lock_ex($lock_key);
				// if (empty($check)) {
				// 	echo '';
				// 	exit;
				// }
				$event = $postObj->Event;
				$eventkey = $postObj->EventKey;
				switch ($event) {

				// 用户关注帐号事件推送
				case "subscribe":
					$college = @preg_replace("/\\\u([0-9a-f]{4})/ie", "iconv('UTF-16BE', 'UTF-8', pack('H4','\\1'))", $eventkey);
					$college = str_replace("qrscene_", "", $college);
					$text = '哇，机智如你！点击<a data-miniprogram-appid="wxb518954af3e70b39
" data-miniprogram-path="/pages/date/city/index" >UNIBBS校内社区</a>，进入你的大学。吐槽发帖、求助问答、买卖二手、出租房屋、参加活动…都在这儿了！';
					if ($college) {
						$text = '哇，机智如你！点击<a data-miniprogram-appid="wxb518954af3e70b39
" data-miniprogram-path="/pages/date/index/index?college=' . $college . '" >UNIBBS校内社区</a>，进入你的大学。吐槽发帖、求助问答、买卖二手、出租房屋、参加活动…都在这儿了！';
					}

					echo $this->responseText($text, $fromUsername, $toUsername);
					$this->saveUser($fromUsername);
					break;

				// 用户扫描事件推送
				case "SCAN":
					$college = @preg_replace("/\\\u([0-9a-f]{4})/ie", "iconv('UTF-16BE', 'UTF-8', pack('H4','\\1'))", $eventkey);
					$text = '机智如你，欢迎关注unibbs校内公告牌，立刻加入<a data-miniprogram-appid="wxb518954af3e70b39
" data-miniprogram-path="/pages/date/index/index?college=' . $college . '" >' . $college . '</a>。';
					echo $this->responseText($text, $fromUsername, $toUsername);
					break;

				// 点击事件
				case "CLICK":
					$lock_key = sprintf('click_lock_%s_', $fromUsername . $postObj->EventKey);
					$this->setLog($lock_key);
					$redis = new GoodsRedis();
					$check = $redis->add_nx_lock_ex($lock_key);
					if (empty($check)) {
						echo '';
						exit;
					}
					switch ($key) {
					case "MY_RECORD":
						$this->getMyRecord($fromUsername, $toUsername);
						echo "";
						exit;
						break;
					}

					break;
				}
				break;

			// 接收用户地理位置
			case "location":

				$text = $toUsername;
				echo $this->responseText($text, $fromUsername, $toUsername);
				break;
			// 默认
			default:
				echo "";
				break;
			}

			// xml无效
		} else {
			echo "";
			exit;
		}
	}

	// 内部接口发送自定义消息
	public function selfSendMessage($openid, $content) {
		$data = '{
				    "touser":"' . $openid . '",
				    "msgtype":"text",
				    "text":{"content":"' . $content . '"}
				}';
		$url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' . $this->getAccessToken();
		$res = $this->http->httpsPostNoCode($url, $data);
		$this->setLog($res);
	}

	// 提供给外部接口发送自定义消息
	public function customMessage() {
		$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
		$post = json_decode($rws_post);
		$data = '{
				    "touser":"' . $post->openid . '",
				    "msgtype":"text",
				    "text":{"content":"' . $post->content . '"}
				}';
		$url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' . $this->getAccessToken();
		$res = $this->http->httpsPostNoCode($url, $data);
		$this->setLog($url);
		$this->setLog($res);
	}

	public function setLog($res) {
		file_put_contents($this->log, json_encode($res, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);
	}

	// 保存公众号的用户到数据库
	public function saveUser($openid) {
		$sql = 'insert into user(openid,createtime,belong) value("' . $openid . '","' . time() . '", "' . $this->from . '") ON DUPLICATE KEY UPDATE  belong="' . $this->from . '"';
		$this->db->dql($sql);
	}

	public function saveAccount($openid, $account, $pwd) {
		$sql = 'insert into user(openid,account,pwd,belong) value("' . $openid . '","' . $account . '", "' . $pwd . '","' . $this->from . '") ON DUPLICATE KEY UPDATE account="' . $account . '",pwd="' . $pwd . '",belong="' . $this->from . '"';
		$this->db->dql($sql);
	}

	// 用户绑定自己的大学
	public function bindCollege($openid, $college) {
		$sql = 'insert into user(openid,college,belong) value("' . $openid . '","' . $college . '","' . $this->from . '") ON DUPLICATE KEY UPDATE college="' . $college . '"';
		$this->db->dql($sql);
	}

	// 查询用户成绩
	public function getMyRecord($openid, $appid) {
		$sql = 'select * from user where openid ="' . $openid . '" limit 1';
		$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
		$this->setLog($res);
		$text = '';
		if ($res['college']) {
			if ($res['account'] && $res['pwd']) {
				$text = '你绑定的学校是' . $res['college'] . ',你的教务账号是' . $res['account'] . '，密码是' . $res['pwd'] . '，正在查询···';
				$this->selfSendMessage($openid, $text);
				$shell = "sudo sh /home/wwwroot/default/spider/scrapy.sh " . $res['account'] . " " . $res['pwd'] . " " . $openid;
				shell_exec($shell);
			} else {
				$text = '请输入你教务系统账号+密码，例如：12345+89075123';
				echo $this->responseText($text, $openid, $appid);
			}
		} else {
			$text = '请先绑定你的大学，输入：绑定XXXX。例如：绑定北京大学';
			echo $this->responseText($text, $openid, $appid);
		}

	}

	public function test() {
		$sql = 'select * from user where openid="oAyT800qYutT1sa4AMetZFOD1pvU" limit 1';
		$res = mysql_fetch_array($this->db->dql($sql), MYSQL_ASSOC);
		var_dump($res);
		var_dump($res['college']);
		var_dump($res->college);
	}

}
