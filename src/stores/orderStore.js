import {defineStore} from "pinia";
import {authApi} from "boot/axios.js";
import {ref} from "vue";

export const useOrderStore = defineStore('orderStore', () => {
    const orders = ref([])
    const tableParams = ref({
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: true,
        filters: {},
        total: 0,orders
    })

    const fetchOrders = async () => {
        try {
            const response = await authApi.get('orders', {
                params: {
                    page: tableParams.value.page,
                    rowsPerPage: tableParams.value.rowsPerPage,
                    sortBy: tableParams.value.sortBy,
                    descending: tableParams.value.descending,
                    filters: JSON.stringify(tableParams.value.filters)
                }
            })
            orders.value = response.data.data
            tableParams.value.total = response.data?.meta?.total ?? 0
        } catch (e) {
            console.error(e)
            throw e;
        }
    }



    const fetchOrdersById = async (id) => {
        try {
            const response = await authApi.get('orders/' + id)
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to fetch order';
        }
    }

    const updateItem = async (id, payload) => {
        try {
            payload.append('_method', 'PUT')

            const response = await authApi.post('orders/' + id, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (e) {
            console.error(e)
            throw e.response?.data?.message || 'Failed to update order';
        }
    }


    return {
        fetchOrders,
        orders,
        fetchOrdersById,
        tableParams
    }
})