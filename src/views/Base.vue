<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="bg-green-600" v-slot="{ open }">
      <!-- Main navigation panel -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left navigation -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-8 w-auto" src="../assets/bnix.png" alt="Logo">
            </div>

            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link v-for="item in navigation" :key="item.name" :to="{ name: item.route, params: {} }" :class="[isMenuActive(item.route) ? 'bg-green-900 text-white' : 'text-gray-200 hover:bg-green-500 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="isMenuActive(item.route) ? 'page' : undefined">{{ item.name }}</router-link>
              </div>
            </div>
          </div>

          <!-- Right navigation -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profile dropdown -->
              <Menu as="div" class="ml-3 relative">
                <div>
                  <MenuButton class="max-w-xs bg-green-600 rounded-full flex items-center text-sm text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white">
                    <span class="sr-only">Open user menu</span>
                    <img class="h-8 w-8 rounded-full" src="../assets/fishon.png" alt="Profile">
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="origin-top-right absolute right-0 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }" @click="logout(item.name)">
                      <a :href="item.href" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{ item.name }}</a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>

          <!-- Mobile navigation toggle -->
          <div class="-mr-2 flex md:hidden">
            <DisclosureButton class="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-green-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <!-- Mobile navigation panel -->
      <DisclosurePanel class="md:hidden">
        <!-- Navigation menu -->
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" href="#" @click.prevent="$router.push({ name: item.route })" :class="[isMenuActive(item.route) ? 'bg-green-900 text-white' : 'text-gray-200 hover:bg-green-500 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="isMenuActive(item.route) ? 'page' : undefined">
            {{ item.name }}
          </DisclosureButton>
        </div>

        <!-- User menu -->
        <div class="pt-4 pb-3 border-t border-gray-300">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" src="../assets/fishon.png" alt="Profile">
            </div>

            <div class="ml-3">
              <div class="text-base font-medium leading-none text-white">{{ user.name }}</div>
              <div class="text-sm font-medium leading-none text-gray-300">{{ user.email }}</div>
            </div>
          </div>

          <div class="mt-3 px-2 space-y-1">
            <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href" @click="logout(item.name)" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-green-500">
              {{ item.name }}
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <router-view />
  </div>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { UserIcon, MenuIcon, XIcon } from '@heroicons/vue/outline'
import BniService from '../services/BniService.js'

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    UserIcon,
    MenuIcon,
    XIcon,
  },
  data() {
    return {
      navigation: [
        { name: 'Accounts', route: 'accounts' },
        { name: 'Transfers', route: 'transfers' },
      ],
      user: {
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
      },
      userNavigation: [
        { name: 'Logout', href: '#' },
      ],
    }
  },
  methods: {
    isMenuActive(route) {
      return this.$route.name.startsWith(route)
    },
    logout(name) {
      if (name == 'Logout') {
        BniService.logout()
          .then((response) => {
            localStorage.removeItem('name')
            localStorage.removeItem('email')
            localStorage.removeItem('token')
            localStorage.removeItem('bToken')
            this.$router.push({ name: 'login' })
          })
          .catch((error) => {
            if (error.response.status == 401) {
              alert(error.response.data.message)
              this.$router.push({ name: 'login' })
            } else {
              alert(error.message)
            }
          })
      }
    }
  }
}
</script>
