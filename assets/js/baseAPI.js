// 注意：每次调用 $.get() $.post()  $.ajax() 的时候
// 会先调用 ajaxPrefilter 函数
// 在这个函数中，可以拿到我们给 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  // options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  options.url = 'http://www.liulongbin.top:3007' + options.url
  //www.liulongbin.top:3008
  // console.log(options.url)

  // 统一为有权限的接口，设置headers 请求头
  // 如果 url 地址里面包含 /my/  则说明为有权限的接口，需要设置headers
  http: if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    }
  }
  options.complete = function (res) {
    // 在complete 函数中，可以使用res.responseJSON 获取到相应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1、清空token
      localStorage.removeItem('token')
      // 2、跳转到登录页面
      location.href = '/login.html'
    }
  }
})
