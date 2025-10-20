import {defineStore} from "pinia";
import {publicApi, authApi} from "boot/axios.js";
import {useQuasar} from "quasar";
import {ref} from "vue";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('authStore', () => {
    const $q = useQuasar();
    const router = useRouter();
    const currentUser = ref({});
    const accessToken = ref(localStorage.getItem('access_token') || '');
    const login = async (payload) => {
        try {
            const res = await publicApi.post('auth/login', payload)
            accessToken.value = res.data.token
            localStorage.setItem('access_token', accessToken.value);
            currentUser.value = res.data.user || {};

            $q.notify({ message: 'Login Successfully', color: "positive" });
            return true
        } catch (e) {
            $q.notify({ message: `Failed to login: ${e.response?.data?.message || e.message}`, color: "negative" });
            return false
        }
    }

    const register = async (payload) => {
        try {
            const res = await publicApi.post('auth/register', payload)
            accessToken.value = res.data.token
            localStorage.setItem('access_token', accessToken.value);
            if (accessToken.value) {
                await router.push('/');
                if (res.data.status === 200) {
                    $q.notify({
                        message: 'Registered Successfully',
                        color: "positive"

                    })
                    return true
                }
            }
        } catch (e) {
            $q.notify({
                message: `Failed to register: ${e.response?.data?.message || e.message}`,
                color: "negative"
            })
            return false
        }

    }

    const logout = async () => {
        await authApi.post('auth/logout');
        accessToken.value = '';
        currentUser.value = null;
        localStorage.removeItem('access_token');
        router.push('/login');
    };

    const validateToken = async () => {
        if (!accessToken.value) return false;

        try{
            const res = await authApi.get('auth/me');
            currentUser.value = res.data.user
            return true
        }
        catch (e)
        {
            console.error(e)
            await logout();
            return false;
        }
    }

    return {
        login,
        register,
        accessToken,
        logout,
        validateToken
    }
})