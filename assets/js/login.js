$(function () {
  // 点击“去注册账号”的链接
  // 给登录区域的 a 链接 绑定点击事件，
  // 点击了去注册账号后，登录区域会隐藏，注册区域会显示
  $('#link-reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //  点击“去登录”的链接
  // 给注册区域的 a 链接，绑定点击事件
  // 点击了去登录后，注册区域会隐藏，登录区域会显示
  $('#link-login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从layui 中获取form 对象，只要导入了layui.js文件，就会出现layui
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify()自定义校验规则
  form.verify({
    // 创建了一个自定义的 pwd  的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中国的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则进行一个提示消息即可

      // $('.reg-box[name = password]') 拿到了密码框
      var pwd = $('.reg-box [name = password]').val()

      if (pwd !== value) {
        return '两次输入的密码不一致！'
      }
    },
  })
  // 监听注册表单提交事件
  $('#form-reg').on('submit', function (e) {
    // 1.阻止表单的默认提交行为
    e.preventDefault()
    // 2.发起aiax 数据请求
    var data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
    $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功！请登录')
      // 模拟人的点击行为
      $('#link-login').click()
    })
  })
  // 监听登录表单提交事件
  $('#form-login').submit(function (e) {
    // 1. 阻止默认表单提交行为
    e.preventDefault()
    // 2. 发起ajax请求事件
    $.ajax({
      method: 'POST',
      url: '/api/login',
      // 快速获取表单的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')

        // console.log(res.token)
        // 将登录成功后得到的 token 字符串 保存到localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      },
    })
  })
})
