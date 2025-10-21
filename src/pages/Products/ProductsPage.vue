<template>
  <list-table
      title="Products"
      create-page-url="ProductsCreate"
      edit-page-url="ProductsEdit"
      :rows="products"
      :columns="columns"
      :computed-columns="[{name: 'status'},{name: 'media'}]"
      :loading="loading"
      @delete_item="deleteRow"
      @update:pagination="onPaginationChange"
      :pagination="tableParams"
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
              <q-icon name="mdi-magnify" color="primary" />
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
                {label: 'Active',value: 1},
                {label: 'Inactive',value: 0},
            ]"
              emit-value
              map-options
              clearable
              @update:model-value="fetchProducts"
          />
        </div>
        <div>
          <q-select
              v-model="tableParams.filters.featured"
              outlined
              filled
              class="tw-w-[200px]"
              label="Is Featured"
              :options="[
                {label: 'Yes',value: 1},
                {label: 'No',value: 0},
            ]"
              emit-value
              map-options
              clearable
              @update:model-value="fetchProducts"
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
            :color="props.row.status ? 'positive' : 'negative'"
            :label="props.row.status ? 'Active' : 'Inactive'"
            rounded
            class="tw-px-4 tw-py-1.5 tw-font-medium"
        />
      </q-td>
    </template>

    <template #body-cell-media="props">
      <q-td :props="props">
        <div class="tw-flex tw-justify-center">
          <q-avatar size="60px" rounded>
            <q-img
                :src="getProductMainImage(props.row)"
                height="60px"
                width="60px"
                class="tw-object-cover"
                :ratio="1"
            >
              <template v-slot:error>
                <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-bg-gray-100">
                  <q-icon name="mdi-image-off" size="24px" color="grey-5" />
                </div>
              </template>
              <template v-slot:loading>
                <q-spinner color="primary" size="20px" />
              </template>
            </q-img>
          </q-avatar>
        </div>
      </q-td>
    </template>
  </list-table>
</template>

<script setup>
import ListTable from "components/Common/ListTable.vue";
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";
import {useProductStore} from "stores/productStore.js";

const productStore = useProductStore();
const {fetchProducts, deleteProduct} = productStore
const {products,tableParams} = storeToRefs(productStore)
const $q = useQuasar()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await fetchProducts()
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
    style: 'width: 80px'
  },
  {
    name: 'media',
    label: 'Image',
    field: 'media',
    sortable: false,
    align: 'center',
    style: 'width: 100px'
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left'
  },
  {
    name: 'slug',
    label: 'Slug',
    field: 'slug',
    sortable: true,
    align: 'left',
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    sortable: true,
    align: 'left'
  },
  {
    name: 'discount_price',
    label: 'Discount Price',
    field: 'discount_price',
    sortable: true,
    align: 'left'
  },
  {
    name: 'stock',
    label: 'Stock',
    field: 'stock',
    sortable: true,
    align: 'left'
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    sortable: true,
    align: 'left'
  },
  {
    name: 'is_featured',
    label: 'Is Featured',
    field: row => row.is_featured ? 'Yes' : 'No',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    sortable: false,
    align: 'center',
  },
])

const deleteRow = async (id) => {
  try {
    $q.dialog({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this Product? This action cannot be undone.',
      cancel: {
        label: 'Cancel',
        color: 'grey-7',
        flat: true
      },
      ok: {
        label: 'Delete',
        color: 'negative',
        unelevated: true
      },
      persistent: true,
    }).onOk(async () => {
      loading.value = true
      try {
        await deleteProduct(id)
        await fetchProducts()
        $q.notify({
          message: 'Product deleted successfully',
          color: 'positive',
          icon: 'mdi-check-circle',
          position: 'top'
        })
      } catch (error) {
        $q.notify({
          message: error?.message || 'Failed to delete Product',
          color: 'negative',
          icon: 'mdi-alert-circle',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    })
  } catch (e) {
    $q.notify({
      message: e?.message || 'An error occurred',
      color: 'negative',
      icon: 'mdi-alert-circle',
      position: 'top'
    })
  }
}


const getProductMainImage = (product) => {
  if(!product.media.length) {
    return '/placeholder-image.png'
  }

  const mainImage = product.media.find((elem) => elem.type === 'image');
  return mainImage?.url || '/placeholder-image.png'
}

const onSearch = async () => {
  loading.value = true
  try {
    tableParams.value.page = 1
    await fetchProducts()
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

    await fetchProducts()
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
  fetchProducts()
}

const refresh = async () => {
  loading.value = true
  try{
    await fetchProducts()
  }finally {
    loading.value = false
  }
}

</script>