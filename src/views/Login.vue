<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-24 w-auto" src="../assets/bnix.png" alt="BNIX">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>

      <form class="space-y-6" action="#" method="POST" @submit.prevent="submitLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input id="email" type="email" name="email" v-model="email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" autocomplete="email" placeholder="Email" required>
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" type="password" name="password" v-model="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" autocomplete="current-password" placeholder="Password" required>
          </div>
        </div>

        <div>
            <button type="submit" class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Login
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BniService from '../services/BniService'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    submitLogin() {
      BniService.login(this.email, this.password)
        .then((response) => {
          localStorage.setItem('name', response.data.user.name)
          localStorage.setItem('email', response.data.user.email),
          localStorage.setItem('token', response.data.token)
          this.getBniToken()
          this.$router.push({ name: 'accounts' })
        })
        .catch((error) => {
          if (error.response.status == 422) {
            alert(error.response.data.message)
          } else {
            alert(error.message)
          }
        })
    },
    getBniToken() {
      BniService.getBniToken()
        .then((response) => {
          console.log(response.data.token)
          localStorage.setItem('bToken', response.data.token)
        })
        .catch((error) => {
          alert(error.message)
        })
    },
  },
}
</script>
