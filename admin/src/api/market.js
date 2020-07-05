

import service from '../axios/axios'

// 保存excel信息
export const uploadExcel = data => {
    return service({
        url: '/wechat.php?ctrl=bike&action=uploadExcel',
        method: 'post',
        data
    })
}

