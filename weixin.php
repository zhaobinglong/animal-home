
<?php
    //计算JSSDK的配置信息
	include 'jssdk.class.php';
	$jssdk = new JSSDK();
	// $log = new log("../log/");
	// echo json_encode($jssdk->GetSignPackage($_GET['url']));

	switch($_GET['action']){
        
        // 微信小程序 调用接口获取openid
		case 'openid':
           echo $jssdk->getOpenid($_GET['jscode']);
		   break;

		//  获取调用js api的token
		case 'token':
		   echo $jssdk->getAccessToken();
		   break;
        
        // 通过base的方式获取用户openid
		case 'baseinfo':
		   $jssdk->getBaseInfoByCode($_GET['code']);
		   break;

		// 获取调用jsapi时候的签名
		case 'signature':
		    echo  $jssdk->getSignPackage($_GET['url']);
            break;
		//一旦用户授权登陆,拿到用户openid，就去生成分享图片
		// action=qrcode&openid=123456&subject=123;
		case 'qrcode':
			$openid = $_GET['openid'];
			$subject = $_GET['subject'];
		    $jssdk->createQrcode($openid,$subject);
			break;
	    case 'test':
		    $jssdk->test();
			break;

	    // 获取微信公众后后台所有图文消息
	    case 'getArticleList':
		    echo $jssdk->getArticleList();
			break;

        // 获取用户分享的
		// 调试成功
		case 'getShareImg':
		    $shell = "sudo sh /home/wwwroot/default/spider/unibbs/run.sh " . $_GET['id'] . " 2>&1";
			$res = shell_exec($shell);
		    echo $res;
			break;

	}

?>
