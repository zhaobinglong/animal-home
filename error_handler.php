<?php
//TODO::加上日志
set_error_handler(function ($level, $message, $file, $line) {
    $data = [
        'msg' => $message,
        'file' => $file,
        'line' => $line,
        'level'=>$level
    ];
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    if ($level != E_DEPRECATED) {
        build_return($data, -100);
    }
});

set_exception_handler(function ($e) {
    $data = [
        'msg' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' =>  $e->getLine(),
    ];
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    build_return($data, $e->getCode());
});

function build_return($data = [], $status = 0, $msg = '', $ext = NULL)
{
    $ret = array(
        'status' => $status,
        'msg' => $msg,
        'data' => $data
    );

    if ($ext) {
        $ret['ext'] = $ext;
    }
    echo json_encode($ret, JSON_UNESCAPED_UNICODE);
    exit(0);
}