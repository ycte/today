/* eslint-disable no-console */
export const LearnToLogin = {
  logic() {
    console.log(this)
    const res = () => 'need_login?'
      ? 'url.includes("logout")' ? 'index' : 'login'
      : null
    return res()
  },
}
