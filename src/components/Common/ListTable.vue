<template>
  <div class="q-pa-md">
    <q-card flat bordered class="tw-shadow-sm">
      <q-table
          :title="title"
          :rows="rowsWithIndex"
          :columns="mergedColumns"
          :loading="loading"
          row-key="id"
          v-model:pagination="localPagination"
          :rows-number="pagination.total"
          @request="onRequest"
          flat
          class="modern-table"
      >
        <template #top>
          <div class="tw-w-full tw-flex tw-items-center tw-justify-between">
            <div>
              <div class="text-h5 tw-font-bold tw-text-gray-800 tw-mb-5">{{ title }}</div>
              <slot name="top-left"></slot>
            </div>
            <slot name="top-middle"></slot>
            <div>
              <slot name="top-right"></slot>
              <q-btn
                  label="Create New"
                  icon="mdi-plus"
                  color="primary"
                  unelevated
                  no-caps
                  class="tw-px-6"
                  @click="$router.push({ name: createPageUrl })"
              />
              <slot name="top-right-last"></slot>
            </div>
          </div>
        </template>

        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps"/>
        </template>

        <template #body-cell-index="props">
          <q-td :props="props">
            <div class="tw-font-medium tw-text-gray-600">
              {{ props.row.index }}
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="tw-flex tw-gap-1 tw-justify-center">
              <q-btn
                  icon="mdi-pencil"
                  flat
                  dense
                  round
                  color="primary"
                  @click="editItem(props.row)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                  icon="mdi-delete"
                  flat
                  dense
                  round
                  color="negative"
                  @click="deleteItem(props.row)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useRouter} from "vue-router";

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  createPageUrl: {
    type: String,
    required: true
  },
  editPageUrl: {
    type: String,
    required: true
  },
  computedColumns: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      rowsPerPage: 50,
      sortBy: 'id',
      descending: true,
      total: 0
    })
  }
})

const emit = defineEmits(['delete_item', 'update:pagination']);

const localPagination = ref({
  page: props.pagination.page,
  rowsPerPage: props.pagination.rowsPerPage,
  sortBy: props.pagination.sortBy,
  descending: props.pagination.descending,
  rowsNumber: props.pagination.total
})

watch(() => props.pagination, (newVal) => {
  localPagination.value = {
    page: newVal.page,
    rowsPerPage: newVal.rowsPerPage,
    sortBy: newVal.sortBy,
    descending: newVal.descending,
    rowsNumber: newVal.total
  }
}, { deep: true })

const onRequest = (requestProps) => {
  const { page, rowsPerPage, sortBy, descending } = requestProps.pagination

  emit('update:pagination', {
    page,
    rowsPerPage,
    sortBy,
    descending
  })
}

const mergedColumns = computed(() => {
  const all = [...props.columns]
  props.computedColumns.forEach(col => {
    if (!all.find(c => c.name === col.name)) {
      all.push({
        label: col.label || col.name,
        field: col.field || col.name,
        align: col.align || 'center',
        sortable: col.sortable ?? true
      })
    }
  })
  return all
})

const rowsWithIndex = computed(() =>
    props.rows.map((row, index) => ({
      ...row,
      index: (localPagination.value.page - 1) * localPagination.value.rowsPerPage + index + 1
    }))
)

const router = useRouter();
const editItem = (row) => {
  router.push({name: props.editPageUrl, params: {id: row.id}})
}

const deleteItem = (row) => {
  emit('delete_item', row.id);
}
</script>

<style scoped lang="scss">
.modern-table {
  :deep(.q-table__top) {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(thead tr th) {
    font-weight: 700;
    font-size: 1rem;
    color: #374151;
    background-color: #f9fafb;
    letter-spacing: 0.025em;
  }

  :deep(tbody tr td) {
    padding: 16px 12px;
  }

  :deep(.q-table__bottom) {
    border-top: 1px solid #e5e7eb;
    padding: 12px 24px;
  }
}
</style>