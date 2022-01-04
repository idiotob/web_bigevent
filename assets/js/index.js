$(function () {
  // 调用 getUserInfo() 获取用户的基本信息
  getUserInfo()

  var layer = layui.layer

  // 点击退出按钮，实现退出功能
  $('#btnLogOut').on('click', function () {
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      // 1.清空本地储存中的 token
      localStorage.removeItem('token')

      // 2. 跳转到登录界面
      location.href = '/login.html'

      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 获取hearders 请求头的配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message)
      }
      // 调用 renderAvatar() 渲染用户头像函数
      renderAvatar(res.data)
    },
    // 不论 成功还是失败，都会调用complete 函数
    // complete: function (res) {
    //   // console.log(res)
    //   // 在complete 函数中，可以使用res.responseJSON 获取到相应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1、清空token
    //     localStorage.removeItem('token')
    //     // 2、跳转到登录页面
    //     location.href = '/login.html'
    //   }
    // },
  })
}

// 渲染用户头像函数
function renderAvatar(user) {
  // 1.获取用户的名称，判断用户是否有昵称，
  // 如果有昵称先用昵称，如果没有昵称用登录的名称

  var name = user.nickname || user.username

  // 2. 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

  // 3. 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 3.2 渲染图片头像
    // toUpperCase() 获取大写
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
    $('.layui-nav-img').hide()
  }
}
