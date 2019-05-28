const axios = require('axios');

const baseUrl = 'http://cnodejs.org/api/v1'

//  1、无需accessToken就能请求的接口
//  2、登录接口
//  3、需要accessToken请求的接口

module.exports = function(req,res) {
  const path = req.path // 接口地址
  const user = req.session.user || {} // 判断用户有没有登录
  const needAccessToken = req.query.needAccessToken // 判断要不要accessToken

  if(needAccessToken && !user.accessToken) {
    res.status(401).send({
      success:false,
      msg: 'need login'
    })
  }

  // 删掉query中的accessToken
  const query = Object.assign({}, req.query)
  if(query.needAccessToken) delete query.needAccessToken

  axios(`${baseUrl}${path}`,{
    method: req.method,
    params: query,
    data: Object.assign({},req.body,{
      accessToken: user.accessToken
    }),
    headers: {
      "Content-Type": "application/www-form-urlencode"
    }
  })
  .then(resp => {
    if(resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  })
  .catch(err => {
    if(err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success:false,
        msg:'未知错误'
      })
    }
  })
}
