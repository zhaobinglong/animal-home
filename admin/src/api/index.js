

import service from '../axios/axios'

// 获取内容列表
export const getList = data => {
    return service({
        url: '/wechat.php?ctrl=zt&action=getList',
        method: 'post',
        data
    })
}

// 获取内容详情
export const getDetail = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getDetail',
        method: 'post',
        data
    })
}

// 用户登录
export const userLogin = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=login',
        method: 'post',
        data
    })
}

// 获取单一用户信息
export const getInfo = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getInfo',
        method: 'post',
        data
    })
}

// 用户登录
export const userList = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=getUserList',
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
        url: '/wechat.php?ctrl=api&action=getTypeList',
        method: 'get',
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

// 编辑帖子状态
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

export const searchCollege = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=searchCollege',
        method: 'post',
        data
    })
}

export const getCollegeById = id => {
    let data = {
        id: id
    }
    return service({
        url: '/wechat.php?ctrl=api&action=getCollegeById',
        method: 'post',
        data
    })
}


export const editCollege = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=editCollege',
        method: 'post',
        data
    })
}

export const search = data => {
    return service({
        url: '/wechat.php?ctrl=api&action=search',
        method: 'post',
        data
    })
}

// 获取测试学校教务系统的cookie
export const getYcuHome = data => {
    return service({
        url: '/ycu.php',
        method: 'get',
    })
}
// 获取测试学校的验证码
export const getYcuCodeImg = data => {
    return service({
        url: '/ycu_code_img.php',
        method: 'get'
    })
}

// 获取测试学校的验证码
export const ycuLogin = data => {
    return service({
        url: '/ycu_login.php',
        method: 'post',
        data
    })
}

// 获取成绩图片
export const ycuScoreImg = data => {
    return service({
        url: '/ycu_save.php',
        method: 'post',
        data
    })
}