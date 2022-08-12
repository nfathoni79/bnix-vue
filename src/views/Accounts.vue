<template>
  <div>
    <BaseContent title="Bank Accounts">
      <div class="mb-2 flex flex-col sm:flex-row gap-2">
        <div class="grow flex items-center">
          <label for="search" class="sr-only">Search</label>
          <input id="search" type="search" name="search" v-model="form.search" class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Search Account Number or Name">
        </div>
        <div>
          <BaseButton color="green" @click="openAddModal">Add Account</BaseButton>
        </div>
      </div>

      <BaseTable>
        <template v-slot:head>
          <tr>
            <th v-for="header in tableHeaders" :key="header" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </template>

        <template v-slot:body>
          <tr v-for="account in accounts" :key="account.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ account.number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ account.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getStatusText(account.status) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ account.ogp ? 'Yes' : 'No' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              {{ account.balance != null ? formatCurrency(account.balance) : '?' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ account.updated_at.substring(0, 10) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <a href="#" @click.prevent="openUpdateModal(account.id)" class="text-blue-600 hover:text-blue-900">Re-check</a>
            </td>
          </tr>
        </template>
      </BaseTable>
    </BaseContent>

    <!-- Add account modal -->
    <BaseModal :open="addModalOpen" :close-function="closeAddModal">
      <form action="#" method="POST" @submit.prevent="addAccount">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
            Add a Bank Account
          </DialogTitle>

          <div class="mt-2">
            <div class="flex items-center">
              <label for="accountNo" class="sr-only">Account Number</label>
              <input id="accountNo" type="text" name="accountNo" v-model="form.accountNo" class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Account Number" required>
            </div>

            <p class="mt-2 text-red-600 sm:text-sm">
              Warning: This action will charge you a small amount of credits.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <BaseButton type="submit" color="green">Add</BaseButton>
          <BaseButton color="red" @click="closeAddModal" class="mt-3 sm:mt-0 sm:mr-3">Cancel</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Update account modal -->
    <BaseModal :open="updateModalOpen" :close-function="closeUpdateModal">
      <form action="#" method="POST" @submit.prevent="updateAccount">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
            Re-check the Status of a Bank Account
          </DialogTitle>

          <div class="mt-2">
            <p class="text-red-600 sm:text-sm">
              Warning: This action will charge you a small amount of credits.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <BaseButton type="submit" color="blue">Check</BaseButton>
          <BaseButton color="red" @click="closeUpdateModal" class="mt-3 sm:mt-0 sm:mr-3">Cancel</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Loading -->
    <Loading loader="dots" color="#16a34a" v-model:active="loading" />
  </div>
</template>

<script>
import { DialogTitle } from '@headlessui/vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import BaseContent from '../components/BaseContent.vue'
import BaseTable from '../components/BaseTable.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseModal from '../components/BaseModal.vue'
import BniService from '../services/BniService.js'

export default {
  components: {
    DialogTitle,
    Loading,
    BaseContent,
    BaseTable,
    BaseButton,
    BaseModal,
  },
  data() {
    return {
      accounts: [],
      tableHeaders: ['Account Number', 'Name', 'Status', 'OGP', 'Balance', 'Last Checked', 'Actions'],
      addModalOpen: false,
      updateModalOpen: false,
      loading: false,
      searchTimer: null,
      form: {
        search: '',
        accountNo: '',
        accountId: null,
      },
    }
  },
  created() {
    this.getAccounts()
  },
  watch: {
    'form.search'(newValue) {
      this.searchAccounts(newValue)
    },
  },
  methods: {
    getAccounts() {
      BniService.getAccounts('', '')
        .then((response) => {
          this.accounts = response.data.accounts
        })
        .catch((error) => {
          if (error.response.status == 401) {
            alert(error.response.data.message)
            this.$router.push({ name: 'login' })
          } else {
            console.log(error)
            alert(error.message)
          }
        })
    },
    searchAccounts(term) {
      clearTimeout(this.searchTimer)

      this.searchTimer = setTimeout(() => {
        BniService.searchAccounts(term)
          .then((response) => {
            this.accounts = response.data.accounts
          })
          .catch((error) => {
            if (error.response.status == 401) {
              alert(error.response.data.message)
              this.$router.push({ name: 'login' })
            } else {
              console.log(error)
              alert(error.message)
            }
          })
      }, 1000);
    },
    addAccount() {
      this.loading = true

      BniService.addAccount(this.form.accountNo)
        .then((response) => {
          this.loading = false

          alert('Successfully added a bank account.')
          this.form.accountNo = ''
          this.form.search = ''
          this.addModalOpen = false
          this.getAccounts()
        })
        .catch((error) => {
          this.loading = false

          if (error.response.status == 401) {
            alert(error.response.data.message)
            this.$router.push({ name: 'login' })
          } else if (error.response.status == 422 || error.response.status == 404) {
            alert(error.response.data.message)
          } else {
            alert(error.message)
          }
        })
    },
    updateAccount() {
      this.loading = true

      BniService.updateAccount(this.form.accountId)
        .then((response) => {
          this.loading = false

          alert('Successfully updated a bank account status.')
          this.form.accountNo = ''
          this.form.search = ''
          this.updateModalOpen = false
          this.getAccounts()
        })
        .catch((error) => {
          this.loading = false

          if (error.response.status == 401) {
            alert(error.response.data.message)
            this.$router.push({ name: 'login' })
          } else if (error.response.status == 422 || error.response.status == 404) {
            alert(error.response.data.message)
          } else {
            alert(error.message)
          }
        })
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return 'Open'
        case 2:
          return 'Dorm'
        case 3:
          return 'Closed'
        default:
          return '?'
      }
    },
    formatCurrency(value) {
      return `Rp ${value.toLocaleString()}`
    },
    openAddModal() {
      this.addModalOpen = true
    },
    closeAddModal() {
      this.addModalOpen = false
    },
    openUpdateModal(accountId) {
      this.form.accountId = accountId
      this.updateModalOpen = true
    },
    closeUpdateModal() {
      this.updateModalOpen = false
    },
  },
}
</script>
