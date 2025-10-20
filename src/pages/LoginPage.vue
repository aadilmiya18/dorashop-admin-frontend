<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-blue-500">
    <q-card class="tw-w-full tw-max-w-md tw-p-6 tw-rounded-xl tw-shadow-lg">
      <div class="tw-text-center tw-mb-6">
        <h2 class="tw-text-2xl tw-font-bold">{{ isLogin ? 'Login' : 'Register' }}</h2>
      </div>

      <!-- Login Form -->
      <q-form ref="loginQForm" v-if="isLogin" @submit.prevent="submitLogin">
        <q-input
            v-model="loginForm.email"
            label="Email"
            outlined
            type="email"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />
        <q-input
            v-model="loginForm.password"
            label="Password"
            outlined
            type="password"
            :rules="[val => !!val || 'Password is required']"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />

        <q-btn type="submit" label="Login" color="primary" class="tw-w-full tw-mt-2" />
      </q-form>

      <!-- Register Form -->
      <q-form ref="registerQForm" v-else @submit.prevent="submitRegister">
        <q-input
            v-model="registerForm.name"
            label="Name"
            outlined
            :rules="[val => !!val || 'Name is required']"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />
        <q-input
            v-model="registerForm.email"
            label="Email"
            outlined
            type="email"
            :rules="[val => !!val || 'Email is required', val => /^\S+@\S+\.\S+$/.test(val) || 'Invalid email']"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />
        <q-input
            v-model="registerForm.password"
            label="Password"
            outlined
            type="password"
            :rules="[val => !!val || 'Password is required']"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />
        <q-input
            v-model="registerForm.mobile"
            label="Mobile"
            outlined
            type="tel"
            :rules="[val => !!val || 'Mobile is required']"
            class="tw-rounded-lg tw-bg-gray-50 tw-mb-4"
        />

        <q-uploader
            url=""
            label="Profile Image"
            @added="onFileAdded"
            :rules="[() => !!registerForm.profile_image || 'Profile Image is required']"
            accept="image/*"
            max-files="1"
            no-thumbnails
            class="tw-rounded-lg tw-w-full tw-mb-4"
        />

        <div v-if="registerForm.profile_image" class="tw-mt-2 tw-text-center">
          <img
              :src="imagePreview"
              alt="Profile Preview"
              class="tw-h-24 tw-w-24 tw-rounded-full tw-object-cover tw-mx-auto tw-border-2 tw-border-indigo-400"
          />
        </div>

        <q-btn type="submit" label="Register" color="primary" class="tw-w-full tw-mt-2" />
      </q-form>

      <div class="tw-text-center tw-mt-4 tw-text-sm">
        <button
            @click="toggleForm"
            class="tw-text-indigo-700 hover:tw-underline focus:tw-outline-none"
        >
          {{ isLogin ? 'Create an account?' : 'Already have an account?' }}
        </button>
      </div>

    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/authStore.js'
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: '',
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  mobile: '',
  profile_image: null,
})

const imagePreview = ref('')

const loginQForm = ref(null)
const registerQForm = ref(null)

const toggleForm = () => {
  isLogin.value = !isLogin.value
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '', mobile: '', profile_image: null }
  imagePreview.value = ''
}

const onFileAdded = (files) => {
  registerForm.value.profile_image = files[0]
  if (files[0]) {
    const reader = new FileReader()
    reader.onload = e => imagePreview.value = e.target.result
    reader.readAsDataURL(files[0])
  }
}

const submitLogin = async () => {
  const valid = await loginQForm.value.validate()
  if (!valid) return
const success =  await authStore.login(loginForm.value)
  if(success) {
    router.push('/');

  }
}

const submitRegister = async () => {
  const valid = await registerQForm.value.validate()
  if (!valid) return

  const formData = new FormData()
  formData.append('name', registerForm.value.name)
  formData.append('email', registerForm.value.email)
  formData.append('password', registerForm.value.password)
  formData.append('mobile', registerForm.value.mobile)
  formData.append('profile_image', registerForm.value.profile_image)

  const success = await authStore.register(formData)
  if (success) {
    isLogin.value = true
  }
}

</script>
