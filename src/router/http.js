import axios from 'axios'
import router from '../router'
const http = axios.create({
  baseURL: 'http://xxx.xxx.x.x/arvr/admin' // 改成自己的接口地址
})
http.interceptors.request.use(
  config => {
    const token = 'Bearer ' + localStorage.getItem('token')
    if(localStorage.getItem('token')) config.headers.Authorization = token
    return config
  },
  err => Promise.error(err)
)

http.interceptors.response.use(res => {
  return res.data
}, err => {
  let {data:{code,msg}, status: status} = err.response
  // 有错误的message
  if(status === 401) { // 用户不存在
    router.push('/login')
  } else if(status === 400) { // 接口缺少参数或参数有误
    if(code === -1) {
      console.log(msg, 'error', 1500)
    } else {
      console.log('接口缺少参数或参数有误', 'error', 1500)
    }
  }
  return Promise.reject(err)
})

export default http