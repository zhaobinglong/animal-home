<?php
// 全局配置文件
//图片根目录
defined('BASE_IMG') or define('BASE_IMG', 'http://examlab.cn/img/');

//日志存放目录
defined('LOG_PATH') or define('LOG_PATH', './log/');

//二维码图片存放目录
defined('QRCODE_PATH') or define('QRCODE_PATH', '../img/');

// UNIBBS小程序信息
defined('APPID') or define('APPID', '在这里输入自定义信息');
defined('APPSECRET') or define('APPSECRET', '在这里输入自定义信息');


// 腾讯地图KEY
defined('MAPKEY') or define('MAPKEY', 'ZT2BZ-C7FWP-DUMD2-VASMB-EUKXJ-ADF7N');
defined('__ROOT__') or define('__ROOT__', realpath(__DIR__));

// 数据库配置相关
defined('MYSQL_NAME') or define('MYSQL_NAME', 'ershou');
defined('MYSQL_HOST') or define('MYSQL_HOST', 'localhost');
defined('MYSQL_PORT') or define('MYSQL_PORT', '');
defined('MYSQL_USER') or define('MYSQL_USER', 'root');
defined('MYSQL_PASS') or define('MYSQL_PASS', 'root');
defined('MYSQL_CONN') or define('MYSQL_CONN', '');

defined('REDIS_HOST') or define('REDIS_HOST', '127.0.0.1');
defined('REDIS_PSW') or define('REDIS_PSW', '');
defined('REDIS_PORT') or define('REDIS_PORT', '6379');
defined('REDIS_DB') or define('REDIS_DB', '0');

?>
