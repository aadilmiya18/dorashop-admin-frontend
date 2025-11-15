<template>
  <list-table
      title="Orders"
      edit-page-url="ProductsEdit"
      :rows="orders"
      :columns="columns"
      :computed-columns="[{name: 'status'}]"
      :loading="loading"
      @update:pagination="onPaginationChange"
      :pagination="tableParams"
      :hide-create-button="true"
  >
    <template #top-left>
      <div class="tw-flex tw-gap-4">
        <div>
          <q-input
              v-model="tableParams.filters.query"
              outlined
              clearable
              class="tw-w-[350px]"
              label="Search by name or slug or sku"
              filled
              debounce="400"
              @update:model-value="onSearch"
          >
            <template #prepend>
              <q-icon name="mdi-magnify" color="primary"/>
            </template>
          </q-input>
        </div>
        <div>
          <q-select
              v-model="tableParams.filters.status"
              outlined
              filled
              class="tw-w-[200px]"
              label="Select Status"
              :options="[
                {label: 'Pending',value: 'pending'},
                {label: 'Paid',value: 'paid'},
                {label: 'Cancelled',value: 'cancelled'},
            ]"
              emit-value
              map-options
              clearable
              @update:model-value="fetchOrders"
          />
        </div>
      </div>

    </template>

    <template #top-right>
      <q-btn
          icon="mdi-filter-off"
          color="red"
          round
          @click="clearFilter"
      />
      <q-btn
          icon="mdi-refresh"
          color="primary"
          round
          class="tw-mx-3"
          @click="refresh"
      />
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge
            :color="
        props.row.status === 'pending' ? 'orange' :
        props.row.status === 'paid' ? 'green' :
        props.row.status === 'cancelled' ? 'red' :
        'gray'
      "
            class="tw-text-sm tw-p-1"
        >
          {{ props.row.status.charAt(0).toUpperCase() + props.row.status.slice(1) }}
        </q-badge>
      </q-td>
    </template>


  </list-table>
</template>

<script setup>
import ListTable from "components/Common/ListTable.vue";
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";
import {useOrderStore} from "stores/orderStore.js";
import moment from 'moment'

const orderStore = useOrderStore();
const {fetchOrders} = orderStore
const {orders, tableParams} = storeToRefs(orderStore)
const $q = useQuasar()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await fetchOrders()
  } finally {
    loading.value = false
  }
})

const columns = ref([
  {
    name: 'index',
    label: 'S.N.',
    field: 'index',
    sortable: true,
    align: 'center',
  },
  {
    name: 'order_id',
    label: 'Order ID',
    field: 'order_id',
    sortable: true,
    align: 'left',
  },
  {
    name: 'ref_id',
    label: 'Ref ID',
    field: 'ref_id',
    sortable: true,
    align: 'left',
  },
  {
    name: 'customer_name',
    label: 'Customer Name',
    field: 'customer_name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'items',
    label: 'Items',
    field: 'items',
    sortable: true,
    align: 'center',
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    field: 'subtotal',
    sortable: true,
    align: 'left',
    format: val => `Rs. ${val}`
  },
  {
    name: 'shipping',
    label: 'Shipping',
    field: 'shipping',
    sortable: true,
    align: 'left',
    format: val => `Rs. ${val}`
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    sortable: true,
    align: 'left',
    format: val => `Rs. ${val}`
  },
  {
    name: 'created_at',
    label: 'Ordered At',
    field: 'created_at',
    sortable: true,
    align: 'left',
    format: val => moment(val).format('YYYY-MM-DD HH:mm')
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'left',
  },
])

const onSearch = async () => {
  loading.value = true
  try {
    tableParams.value.page = 1
    await fetchOrders()
  } finally {
    loading.value = false
  }
}

const onPaginationChange = async (newPagination) => {
  loading.value = true
  try {
    tableParams.value.page = newPagination.page
    tableParams.value.rowsPerPage = newPagination.rowsPerPage
    tableParams.value.sortBy = newPagination.sortBy
    tableParams.value.descending = newPagination.descending

    await fetchOrders()
  } finally {
    loading.value = false
  }
}

const clearFilter = () => {
  tableParams.value = {
    page: 1,
    rowsPerPage: 50,
    sortBy: 'id',
    descending: true,
    filters: {},
    total: 0,
  }
  fetchOrders()
}

const refresh = async () => {
  loading.value = true
  try {
    await fetchOrders()
  } finally {
    loading.value = false
  }
}

</script>