import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";

export const useBrandStore = defineStore('brandStore', () => {
    const brands = ref([])
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,
    })

    const fetchBrands = async () => {
        try {
            const response = await authApi.get('brands', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            brands.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    const submitBrandData = async (payload) => {
        try {
            const response = await authApi.post('brands', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to create brand';
        }
    }

    const fetchBrandsById = async (id) => {
        try {
            const response = await authApi.get('brands/' + id)
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch brand';
        }
    }

    const updateItem = async (id, payload) => {
        try {
            payload.append('_method', 'PUT')

            const response = await authApi.post('brands/' + id, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update brand';
        }
    }
    const deleteItem = async (id) => {
        try {

            const response = await authApi.delete('brands/' + id)
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update brand';
        }
    }

    return {
        fetchBrands,
        brands,
        submitBrandData,
        fetchBrandsById,
        updateItem,
        deleteItem,
        tableParams
    }
})