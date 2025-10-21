import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";

export const useProductStore = defineStore('productStore',()=> {
    const products = ref([])

    const fetchProducts = async () => {
        try {
            const response = await authApi.get('products')
            products.value = response.data.data
        }
        catch (e) {
            console.error(e)
            throw e;
        }
    }

    const submitProductData = async (payload) => {
        try {
            const response = await authApi.post('products', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to create brand';
        }
    }

    const fetchProductById = async (id) => {
        try {
            const response = await authApi.get('products/'+id)
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch brand';
        }
    }

    const updateProduct = async (id, payload) => {
        try {
            payload.append('_method', 'PUT')

            const response = await authApi.post('products/'+id, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update product';
        }
    }
    const deleteProduct = async (id) => {
        try {

            const response = await authApi.delete('products/'+id)
            return response.data
        }
        catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update product';
        }
    }

    return {
        fetchProducts,
        products,
        submitProductData,
        fetchProductById,
        updateProduct,
        deleteProduct
    }
})