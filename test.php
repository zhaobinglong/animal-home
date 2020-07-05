<?php

// include('wxlittle.class.php');
// $wxlittle = new wxlittle();
// $wxlittle->getLittleImg('222','detail');

include 'vendor/autoload.php';

// $whoops = new \Whoops\Run;
// $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
// $whoops->register();

// use QL\QueryList;

// // Using Medoo namespace
use Medoo\Medoo;

// echo "ok";

include __DIR__ . '/core/lib/db.class.php';

$db = new db();

// $sql = 'SELECT e.id,e.openid,e.title,e.cont,e.college,e.imgs,e.imgs_detail,e.symbol,e.price,e.old_price,e.status,e.city,e.address,e.phone,e.level,e.classify,e.category,e.message,e.views,e.liked,e.updatetime,u.nickName,u.avatarUrl,u.status as user_status from ershou as e  left join user as u on e.openid = u.openid where (e.college="西安外国语大学" or "西安外国语大学" ="") and e.status!=0 and (e.classify="" or "" = "") and (e.category="" or "" = "") and (e.openid="" or "" = "") and (e.belong="" or "" ="") and e.openid!="" order by updatetime desc limit 0,20';

$res = $db->database->select("ershou", [
	// Multiple condition
	"[>]user" => [
		"openid" => "openid"
	]
], [
	"ershou.id",
    "ershou.cont",
    "user.avatarUrl"
], [
	"ORDER" => ["ershou.id" => "DESC"],
	"LIMIT" => 50
]);



var_dump($res);
