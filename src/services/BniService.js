import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})


function setToken() {
  const token = localStorage.getItem('token')
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function getBToken() {
  return localStorage.getItem('bToken')
}

export default {
  login(email, password) {
    return apiClient.post('/api/login', {
      email: email,
      password: password,
    })
  },
  logout() {
    setToken()
    return apiClient.post('/api/logout')
  },
  getAccounts() {
    setToken()
    return apiClient.get('/api/accounts')
  },
  searchAccounts(term) {
    setToken()
    return apiClient.get(`/api/accounts/search?term=${term}`)
  },
  getBniToken() {
    setToken()
    return apiClient.post('/api/token')
  },
  addAccount(accountNo) {
    setToken()
    return apiClient.post('/api/accounts', {
      token: getBToken(),
      accountNo: accountNo,
    })
  },
  updateAccount(id) {
    setToken()
    return apiClient.put(`/api/accounts/${id}`, {
      token: getBToken(),
    })
  },
}
