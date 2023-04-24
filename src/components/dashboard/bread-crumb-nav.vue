<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in currentPath"
      :href="item.path"
      :key="item.name"
      >{{ item.title }}</BreadcrumbItem
    >
  </Breadcrumb>
</template>

<script>
export default {
  name: 'bread-crumb-nav',
  props: {
    currentPath: Array,
  },
}
</script>
