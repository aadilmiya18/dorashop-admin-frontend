<template>
  <q-select
      v-model="computedModelValue"
      label="Select Brand"
      outlined
      use-input
      :options="brandStore.brands"
      option-label="name"
      option-value="id"
      emit-value
      map-options
      stack-label
      @clear="computedModelValue = []"
  >
    <template #prepend>
      <q-icon name="mdi-domain" color="primary"/>

    </template>
  </q-select>
</template>

<script setup>
import {useCategoryStore} from "stores/categoryStore.js";
import {computed, onMounted} from "vue";
import {useBrandStore} from "stores/brandStore.js";

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

const brandStore = useBrandStore();

onMounted(brandStore.fetchBrands)
</script>