<template>
  <div>
    <BaseContent title="Transfers">
      <div class="mb-2 flex flex-col sm:flex-row gap-2">
        <div class="grow flex items-center">
          <label for="search" class="sr-only">Search</label>
          <input id="search" type="search" name="search" v-model="form.search"
            class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Search Account Number or Name">
        </div>
        <div>
          <BaseButton color="green" @click="openTransferModal">Transfer</BaseButton>
        </div>
      </div>

      <BaseTable>
        <template v-slot:head>
          <tr>
            <th v-for="header in tableHeaders" :key="header" scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </template>

        <template v-slot:body>
          <tr v-for="transfer in transfers" :key="transfer.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" :title="transfer.from_account.name">
              {{ transfer.from_account.number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" :title="transfer.to_account.name">
              {{ transfer.to_account.number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              {{ formatCurrency(transfer.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.remark }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.crn }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDateTime(transfer.created_at) }}
            </td>
          </tr>
        </template>
      </BaseTable>
    </BaseContent>

    <!-- Transfer modal -->
    <BaseModal :open="transferModalOpen" :close-function="closeTransferModal">
      <form action="#" method="POST" @submit.prevent="transfer">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
            Transfer
          </DialogTitle>

          <div class="mt-2 space-y-2">
            <div class="flex items-center">
              <label for="fromAccount" class="sr-only">From Account</label>
              <select id="fromAccount" name="fromAccountId" v-model="form.fromAccountId" class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
                <option value="">From Account</option>
                <option v-for="account in accounts" :key="account.id" :value="account.id">
                  {{ account.name }} - {{ account.number }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <label for="toAccount" class="sr-only">To Account</label>
              <select id="toAccount" name="toAccountId" v-model="form.toAccountId" class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
                <option value="">To Account</option>
                <option v-for="account in accounts" :key="account.id" :value="account.id">
                  {{ account.name }} - {{ account.number }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <label for="amount" class="sr-only">Amount</label>
              <input id="amount" type="number" name="amount" v-model="form.amount" min="1"
                class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Transfer Amount" required>
            </div>

            <div class="flex items-center">
              <label for="remark" class="sr-only">Remark</label>
              <input id="remark" type="text" name="remark" v-model="form.remark"
                class="grow py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Remark">
            </div>

            <p class="mt-2 text-red-600 sm:text-sm">
              Warning: This action will charge you a small amount of credits.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <BaseButton type="submit" color="green">Transfer</BaseButton>
          <BaseButton color="red" @click="closeTransferModal" class="mt-3 sm:mt-0 sm:mr-3">Cancel</BaseButton>
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
    BniService,
  },
  data() {
    return {
      transfers: [],
      accounts: [],
      tableHeaders: [
        'From Account',
        'To Account',
        'Amount',
        'Remark',
        'CRN',
        'Time',
      ],
      transferModalOpen: false,
      loading: false,
      searchTimeout: null,
      form: {
        search: '',
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        remark: '',
      },
    }
  },
  created() {
    this.getTransfers(this.form.search)
    this.getAccounts('name', 1)
  },
  watch: {
    'form.search'(newValue) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() =>
        this.getTransfers(newValue), 1000)
    },
  },
  methods: {
    getTransfers(search) {
      BniService.getTransfers(search)
        .then((response) => {
          this.transfers = response.data.transfers
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
    transfer() {
      this.loading = true

      BniService.transfer(
        this.form.fromAccountId,
        this.form.toAccountId,
        this.form.amount,
        this.form.remark
      )
      .then((response) => {
        alert('Successfully transferred.')
        this.form.fromAccountId = ''
        this.form.toAccountId = ''
        this.form.amount = ''
        this.form.remark = ''
        this.transferModalOpen = false
        this.getTransfers(this.form.search)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          alert(error.response.data.message)
          this.$router.push({ name: 'login' })
        } else if (error.response.status == 422
            || error.response.status == 404
            || error.response.status == 400) {
          alert(error.response.data.message)
        } else {
          alert(error.message)
        }
      })
      .finally(() => {
        this.loading = false
      })
    },
    getAccounts(sort, ogp) {
      BniService.getAccounts(sort, ogp)
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
    formatCurrency(value) {
      return `Rp ${value.toLocaleString()}`
    },
    formatDateTime(dateTimeString) {
      return new Date(dateTimeString).toLocaleString()
    },
    openTransferModal() {
      this.transferModalOpen = true
    },
    closeTransferModal() {
      this.transferModalOpen = false
    },
  },
}
</script>
