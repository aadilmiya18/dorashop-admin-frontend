import {defineStore} from "pinia";
import {api} from "boot/axios.js";
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
            const res = await api.post('auth/login', payload)
            accessToken.value = res.data.token
            localStorage.setItem('access_token', accessToken.value);
            console.log('res',res)
            if (accessToken.value) {
                if (res.status === 200) {
                    $q.notify({
                        message: 'Login Successfully',
                        color: "positive"
                    })
                    return true
                }
            }
        } catch (e) {
            $q.notify({
                message: `Failed to login: ${e.response?.data?.message || e.message}`,
                color: "negative"
            })
            return false
        }

    }

    const register = async (payload) => {
        try {
            const res = await api.post('auth/register', payload)
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
        await api.post('auth/logout','',{
            headers: {Authorization: `Bearer ${accessToken.value}` }
        });
        accessToken.value = '';
        currentUser.value = null;
        localStorage.removeItem('access_token');
        delete api.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    const validateToken = async () => {
        if (!accessToken.value) return false;

        try{
            const res = await api.get('auth/me',{
                headers: {Authorization: `Bearer ${accessToken.value}` }
            });
            currentUser.value = res.data.user
            return true
        }
        catch (e)
        {
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