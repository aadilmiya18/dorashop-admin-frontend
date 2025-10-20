import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";

export const useCategoryStore = defineStore('categoryStore', () => {
    const categories = ref([])
    const fetchCategories = async () => {
        try {
            const response = await authApi.get('categories')
            categories.value = response.data
        } catch (e) {
            console.error(e)
        }

    }
    const submitCategoryData = async (payload) => {
        try {
            const response = await authApi.post('categories', payload, {
                headers: {"Content-Type": "multipart/form-data"}
            })
            return response.data
        } catch (e) {
            console.error(e)
            throw e;
        }

    }
    return {
        fetchCategories,
        categories,
        submitCategoryData
    }
})