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

include 'db.class.php';
include 'wxlittle.class.php';

$db = new DB();
$jssdk = new wxlittle("wxb518954af3e70b39", "0e7ee5f0b1a5748e5ad7d5618ee01a29");

switch ($_GET['action']) {

// 用户在小程序中的帖子被留言后推送
case 'pushAfterMessgae':
	$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
	$mypost = json_decode($rws_post);
	$data['touser'] = $mypost->toopenid;
	$data['template_id'] = "dgp1OjAIjfz2mr9PbLJ5U2vU4edvkLO0uXpjJhSfAy4";
	$data['page'] = "pages/date/detail/index?id=" . $mypost->id;
	$data['data'] = array(
		'thing1' => array('value' => $mypost->name),
		'thing2' => array('value' => $mypost->cont),
	);
	echo $jssdk->push($data);
	break;

// 用户在小程序中的留言被评论后推送
case 'pushAfterComment':
	$rws_post = $GLOBALS['HTTP_RAW_POST_DATA'];
	$mypost = json_decode($rws_post);
	$data['touser'] = $mypost->toopenid;
	$data['template_id'] = "w7HeJjn-_4G1i0wAkdw8M77f6vvZTpJYtlezi4CdO7s";
	$data['page'] = "pages/date/detail/index?id=" . $mypost->id;
	$data['data'] = array(
		'thing1' => array('value' => $mypost->title),
		'name2' => array('value' => $mypost->name),
		'thing3' => array('value' => $mypost->cont),
	);
	echo $jssdk->push($data);
	// echo json_encode($data);
	break;
case 'time':
	echo time();
	break;
case 'post':
	var_dump($_POST);
	break;

}