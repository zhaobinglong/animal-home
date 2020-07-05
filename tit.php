<?php
// 每个大学一个查成绩的脚本
// 太原工业学院成绩脚本

require_once 'http.class.php';
require './cos-php-sdk-v5-master/cos-autoloader.php';

use Sunra\PhpSimple\HtmlDomParser;

class tit {

	public $cosClient;
	public $bucket;
	public $http;
	public $header;

	// 构造函数，将pdo句柄传递给类
	public function __construct() {
	    $this->cosClient = new Qcloud\Cos\Client(array('region' => 'ap-beijing',
	      'credentials' => array(
	        'appId' => '1251120507',
	        'secretId' => 'AKIDABwYpvMVrIEuOdMTQ5UhjOounxnPw5ze',
	        'secretKey' => 'dybbPx32nLhogJrCLhvxyVt51mh07zlp')));

	    $this->bucket = 'unibbs-1251120507';
	    $this->http = new http();
	    $this->header = array(
	        'Host: 202.207.232.8',
	        'Origin: http://202.207.232.8',
	        'Referer: http://202.207.232.8/xscj/Stu_MyScore_rpt.aspx',
	        'Content-Type: application/x-www-form-urlencoded'
	    );
	}

	public function getCode() {
	    $url = 'http://59.49.30.23/sys/ValidateCode.aspx?t='.mt_rand(1,999999);
	    $header = array(
	        'Content-Type: application/x-www-form-urlencoded',
	        'Host: 59.49.30.23',
	        'Origin: http://59.49.30.23',
	        'Referer: http://59.49.30.23/_data/login_home.aspx'
	    );
	    $res = $this->http->httpGet($url, $header);
	    list($header, $body) = explode("\r\n\r\n", $res);
	    $headers = explode("\r\n", $header); 
		$cookie = explode(": ", $headers[8]); 
	    $name = 'unibbs_tit_code_valify_'.mt_rand(100,999).'.jpeg';

	    // cookie必须传递回去
	    $data['cookie'] = $cookie[1];

	    try {
	      $result = $this->cosClient->putObject(array(
	        'Bucket' => $this->bucket,
	        'Key' => $name,
	        'Body' => $body
	      ));
	      $data['img'] = $result['ObjectURL'];
	       echo json_encode(array(
	        'code' => 200,
	        'data' => $data
	       ));      
	    } catch (\Exception $e) {
	       echo json_encode(array(
	        'code' => 201,
	        'data' => '验证码获取失败'
	       )); 
	    }
	}

	public function userLogin($data) {
	    // 对验证码加密
	    $data['fgfggfdgtyuuyyuuckjg'] = strtoupper(substr(md5(strtoupper(substr(md5(strtoupper($data['yzm'])),0,30)).'10123'),0, 30));

	    $data['Sel_Type'] = 'STU';
	    $data['txt_asmcdefsddsd'] = $data['username'];
	    $data['txt_pewerwedsdfsdff'] = '';
	    $data['txt_sdertfgsadscxcadsads'] = '';
	    $data['typeName'] = ''; 
	    $data['txt_psasas'] = '';
	    $data['dsdsdsdsdxcxdfgfg'] = strtoupper(substr(md5($data['username'].strtoupper(substr(md5($data['password']),0,30)).'10123'),0,30));
	    
	    $url = 'http://59.49.30.23/_data/login_home.aspx';

	    $header = array(
	        'Content-Type: application/x-www-form-urlencoded',
	        'Host: 59.49.30.23',
	        'Origin: http://59.49.30.23',
	        'Referer: http://59.49.30.23/_data/login_home.aspx'
	    );
	    $res = $this->http->httpPost($url, http_build_query($data), $header, $data['cookie']);

	    // 登陆成功，新页面页面有一行js代码自动跳转，所以程序只要判断有那段js代码，
	    // 就是登陆成功，cookie就可以用了
	    // 判断登陆成功的标志：window.top.document.location.replace("../MAINFRM.aspx");

	    if (strstr($res, 'window.top.document.location.replace')) {
	        echo json_encode(array(
	          'code' => 200,
	          'data' => $data,
	        ));  
	    } else {
	        echo json_encode(array(
	          'code' => 201,
	          'data' => '登陆失败',
	        ));        
	    }
	}

	// 登陆成功后获取成绩
	public function getScore($data = null) {
	    $url = 'http://59.49.30.23/xscj/Stu_MyScore_rpt.aspx';
	    $params = array(
	       'sel_xn' => $data['xn'],
	       'btn_search' => '',
	       'SJ' => 1,
	       'SelXNXQ' => 1,
	       'zfx_flag' => 0,
	       'zxf' => 0
	    );

	    $body = $this->http->httpPost($url, http_build_query($params),$this->header, $data['cookie']);

	    // print_r($body);
	    $html = HtmlDomParser::str_get_html( $body );
	    $info = [];
	    $imgs = [];
	    $ossUrl = [];
	    foreach($html->find('td[align=left]') as $element) {
	      $str = str_replace("&ensp;","",$element->innertext);
	      array_push($info,  iconv("GB2312","UTF-8//IGNORE",$str));
	    }

	    foreach ($html->find('img') as $element) {
	      array_push($imgs, 'http://59.49.30.23/xscj/'.$element->src);
	    }
	    // var_dump($info);
	    // var_dump($imgs);

	    for ($i=0; $i < count($imgs); $i++) { 
	        $res = $this->http->httpGetNoHead($imgs[$i], $this->header, $data['cookie']);
	        $name = 'unibbs_tit_'.$data['username'].'_'.$data['xn'].'_'.$i.'.jpeg';
	        try {
	          $result = $this->cosClient->putObject(array(
	            'Bucket' => $this->bucket,
	            'Key' => $name,
	            'Body' => $res
	          ));
	          // var_dump($result);
	          array_push($ossUrl, $result['ObjectURL']);
	        } catch (\Exception $e) {
	          array_push($ossUrl, $e);
	        }
	    }

	    // 如果cookie无效，返回
	    // <span style='font-color:red;font-size:12px' >系统提示：您无权访问此页，可重新<a href='http://202.207.232.8/' target=_top>登录</a>再试！</font>
	    if (strstr($body, '您无权访问此页')) {
	       echo json_encode(array(
	        'code' => 200,
	        'data' => '教务系统提示：您无权访问此页，请重新登录',
	        'msg' => 'error',
	        'post' => $data
	       ));    
	    } else if (strlen($body) == 1141) {
	       echo json_encode(array(
	        'code' => 200,
	        'data' => '教务系统提示：内部服务器错误',
	        'msg' => 'error',
	        'post' => $data
	       ));
	    } else {
	      echo json_encode(array(
	        'code' => 200,
	        'data' => [
	          'info' => $info,
	          'ossUrl' => $ossUrl,
	          'msg' => 'ok' 
	        ]
	       ));
	    }

	}
}