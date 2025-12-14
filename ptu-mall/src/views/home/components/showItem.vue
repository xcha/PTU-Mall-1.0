<script setup>
import { useProductStore } from '@/stores/productStore'
const productStore = useProductStore()

defineProps({
  items: Object,
})
</script>

<template>
  <div class="show-item-container">
    <div class="title">{{ items.name }}</div>
    <div class="item-list">
      <RouterLink :to="`/detail/${subItem.id}`" class="item-card"
        v-for="(subItem, index) in productStore.productList.filter(item => item.categoryId == items.id)" :key="index">
        <img :src="subItem.img" :alt="subItem" class="item-image" />
        <div class="description">{{ subItem.name }}</div>
        <div class="description">{{ subItem.description }}</div>
        <div class="price">¥ {{ subItem.price }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 50px;
  background-color: #f5f5f5;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; // Adjust height as needed for title
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.item-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; // Allow items to wrap to the next line
  gap: 20px; // Space between item cards
}

.item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px; // Fixed width for each item card
  cursor: pointer;
  background-color: white;
  padding: 10px;
  //取消下滑线
  text-decoration: none;

  .description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
    padding-left: 50px;
  }

  .price {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    color: #e4393c;
    font-weight: bold;
    padding-left: 50px;

  }
}

.item-image {
  width: 150px; // Adjust image size
  height: 150px;
  object-fit: cover; // Ensure images cover the area without distortion
  margin-bottom: 10px;
  border-radius: 8px; // Optional: rounded corners for images
}

.item-name {
  font-size: 16px;
  color: #333;
}
</style>
