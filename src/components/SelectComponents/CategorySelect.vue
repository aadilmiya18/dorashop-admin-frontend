<template>
  <q-select
      v-model="computedModelValue"
      label="Select Category"
      outlined
      use-chips
      use-input
      :options="categoryStore.categories"
      option-label="name"
      option-value="id"
      emit-value
      map-options
      stack-label
      @clear="computedModelValue = []"
  >
    <template #prepend>
      <q-icon name="mdi-shape-plus-outline" color="primary"/>

    </template>
  </q-select>
</template>

<script setup>
import {useCategoryStore} from "stores/categoryStore.js";
import {computed, onMounted} from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const computedModelValue = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})

const categoryStore = useCategoryStore();

onMounted(categoryStore.fetchCategories)
</script>