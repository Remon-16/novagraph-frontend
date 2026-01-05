import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 存储登录用户信息的状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref({
    userName: '未登录',
  })

  // setTimeout(() => {
  //   loginUser.value = { userName: '测试用户', id: 1 }
  // }, 3000)

  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  // 返回
  return { loginUser, setLoginUser }
})
