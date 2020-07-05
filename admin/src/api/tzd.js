

import service from '../axios/axios'

// 获取订单信息
export const getOrders = data => {
    return service({
        url: '/wechat.php?ctrl=zt&action=getAllOrders',
        method: 'post',
        data
    })
}

// 编辑用户
export const editUser = data => {
    return service({
        url: '/wechat.php?ctrl=zt&action=editUser',
        method: 'post',
        data
    })
}

// 查询下级用户
export const getNextLevel = data => {
    return service({
        url: '/wechat.php?ctrl=zt&action=getNextLevel',
        method: 'post',
        data
    })
}

// 获取信息列表
export const getList = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getList',
        method: 'post',
        data
    })
}

// 用户登录
export const userLogin = data => {
    return service({
        url: '/wechat.php?ctrl=user&action=login',
        method: 'post',
        data
    })
}

// 用户添加更新商品/banner/视频
export const userPush = data => {
    return service({
        url: '/wechat.php?ctrl=zt&action=push',
        method: 'post',
        data
    })
}

// 获取分类信息
export const getTypeList = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getClassify',
        method: 'post',
        data
    })
}

// 编辑分类信息
export const editType = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=editType',
        method: 'post',
        data
    })
}

// 编辑商品状态
export const editStatus = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=editStatus',
        method: 'post',
        data
    })
}


// 获取banner信息
export const getBanner = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getBanner',
        method: 'post',
        data
    })
}