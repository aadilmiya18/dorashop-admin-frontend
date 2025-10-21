<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-gradient-to-r from-primary to-secondary text-white">
      <q-toolbar class="q-px-md">
        <q-btn flat dense round icon="mdi-menu" aria-label="Menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title class="text-weight-medium text-h6 q-ml-md">
          Dora Shop Admin
        </q-toolbar-title>

        <div class="q-gutter-sm q-ml-auto flex items-center">
          <q-btn flat round dense icon="mdi-logout" @click="authStore.logout"/>
          <q-btn flat round dense icon="mdi-bell"/>
          <q-btn flat round dense icon="mdi-account-circle"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :width="280"
        class="bg-grey-1"
    >
      <div class="q-pa-md text-center bg-white shadow-2 rounded-b-lg">
        <q-avatar size="80px" class="shadow-3">
          <q-img src="../assets/logo.png"/>
        </q-avatar>
        <div class="text-h5 text-weight-bold q-mt-sm text-primary">Dora Shop</div>
        <div class="text-caption text-grey-7">Admin Dashboard</div>
      </div>

      <q-list class="q-pa-md">
        <q-item
            v-for="link in linksList"
            :key="link.title"
            clickable
            @click="goToRoute(link)"
            class="q-my-xs rounded-borders q-pa-sm"
            v-ripple
            :class="{
            'bg-primary text-white': isActiveRoute(link),
            'hover:bg-primary/10': !isActiveRoute(link)
          }"
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon
                :name="link.icon"
                size="22px"
                :class="isActiveRoute(link) ? 'text-white' : 'text-black'"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label
                class="text-body1 text-weight-medium"
                :class="isActiveRoute(link) ? 'text-white' : 'text-black'"
            >
              {{ link.title }}
            </q-item-label>
          </q-item-section>

          <q-item-section side v-if="isActiveRoute(link)">
            <q-icon name="mdi-chevron-right" size="20px" class="text-white"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="tw-bg-gray-100 tw-min-h-screen">
      <q-pull-to-refresh @refresh="refresh">
      <router-view />
      </q-pull-to-refresh>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from "stores/authStore.js";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();

const linksList = ref([
  {title: 'Dashboard', icon: 'mdi-view-dashboard', route: {name: 'Home'}},
  {title: 'Products', icon: 'mdi-package-variant', route: {name: 'Products'}},
  {title: 'Categories', icon: 'mdi-shape-outline', route: {name: 'Categories'}},
  {title: 'Brands', icon: 'mdi-tag-multiple', route: {name: 'Brands'}},
  {title: 'Orders', icon: 'mdi-cart', route: {name: 'Orders'}},
  {title: 'Coupons', icon: 'mdi-ticket-percent', route: {name: 'Coupons'}},
  {title: 'Users', icon: 'mdi-account-multiple', route: {name: 'Users'}},
  {title: 'Settings', icon: 'mdi-cog', route: {name: 'Settings'}},
  {title: 'Shipping', icon: 'mdi-truck', route: {name: 'Shipping'}},
  {title: 'Reports', icon: 'mdi-file-chart', route: {name: 'Reports'}},
  {title: 'Payment Methods', icon: 'mdi-credit-card', route: {name: 'PaymentMethods'}},
  {title: 'Notifications', icon: 'mdi-bell-ring', route: {name: 'Notifications'}},
  {title: 'SEO Tools', icon: 'mdi-magnify', route: {name: 'SEOTools'}},
  {title: 'Marketing', icon: 'mdi-bullhorn', route: {name: 'Marketing'}},
  {title: 'Logs', icon: 'mdi-file-document', route: {name: 'Logs'}},
])

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function isActiveRoute(link) {
  return link.route && route.name === link.route.name
}

function goToRoute(link) {
  if (link.route && link.route.name) {
    router.push(link.route)
  }
}

const refresh = () => {
window.location.reload(true)
}
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(90deg, var(--q-primary), var(--q-secondary));
}

.rounded-borders {
  border-radius: 12px;
}
</style>
