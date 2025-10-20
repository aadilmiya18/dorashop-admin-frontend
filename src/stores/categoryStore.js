import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";

export const useCategoryStore = defineStore('categoryStore',()=> {
    const categories = ref([])

    const fetchCategories = async () => {
        try {
            const response = await authApi.get('categories')
            categories.value = response.data.data
        }
        catch (e) {
            console.error(e)
            throw e;
        }
    }

    const submitCategoryData = async (payload) => {
        try {
            const response = await authApi.post('categories', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to create Category';
        }
    }

    const fetchCategoryById = async (id) => {
        try {
            const response = await authApi.get('categories/'+id)
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch Category';
        }
    }

    const updateItem = async (id, payload) => {
        try {
            payload.append('_method', 'PUT')

            const response = await authApi.post('categories/'+id, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update Category';
        }
    }
    const deleteItem = async (id) => {
        try {

            const response = await authApi.delete('categories/'+id)
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update Category';
        }
    }

    return {
        fetchCategories,
        categories,
        submitCategoryData,
        fetchCategoryById,
        updateItem,
        deleteItem
    }
})