$(function () {
  // 定义美化时间的过滤器

  template.defaults.imports.dataFormat = function (data) {
    var dt = new Date(data)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  // 定义一个查询的参数对象，将来请求数据的时候
  // 将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //分页值,默认为1
    pagesize: 2, // 每页可以查询到几条数据，默认为两条
    cate_id: '', // 文章分类的id
    state: '', // 文章的发布状态
  }

  initTable()
  initCate()
  // 获取文章数据列表的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        console.log(res)

        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 获取文章数据列表

        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      },
    })
  }

  // 初始化文章分类的方法

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }

        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl_cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染 表单区域的 UI结构
        form.render()
      },
    })
  }

  // 为筛选表单绑定submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  // 因为渲染分页是为文章列表服务的，且文章列表出来后知道具体多少页，
  // 所以，调用渲染分页的方法，在文章列表数据UI结构渲染完成后进行调用
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', //分页容器的Id
      count: total, // 总共有多少条数据
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, // 设置默认选择的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],

      // 分页发生切换的时候，触发 jump 的回调函数

      // 触发 jump 回调函数的两种情况
      // 1. 点击页面，调用 jump 函数
      // 2. 调用laypage.render（）函数，触发jump回调函数
      jump: function (obj, first) {
        // 可以通过first 的值来判断是以那种方式触发的jump回调函数
        // 如果 first 的值为true，则是通过第二种方式触发的回调函数，会变成死循环
        // 如果first 的值为undefined，则是第一种方式触发的回调函数
        // console.log(first)

        // 把最新的页码值  赋值给 q 参数对象中，
        // 然后再重新调用文章数据列表方法
        q.pagenum = obj.curr
        // 把最新的条目数，赋值给q 参数对象 的pagesize 属性中
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
        // initTable()
      },
    })
  }

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取到文章的id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          // 当数据删除完成之后，需要判断当前这一页，是否还有数据
          // 如果没有数据，则需要用当前页码值 -1
          // 再调用 initTable 函数

          // 判断页面中删除按钮的个数是否为1，如果为1 ，删除完成之后，则页面上就没有数据了
          // 此时需要让分页值 -1
          if (len === 1) {
            // 分页值最小必须是1

            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        },
      })
      layer.close(index)
    })
  })
})
