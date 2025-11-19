<template>
  <div class="button">
    <div class="s-icon" :style="{ backgroundColor: hoverColor }">
      <i :class="iconClass"></i>
    </div>
    <span>
      <a
        :href="href"
        class="text-black hover:underline transition-colors duration-300"
        :style="{ color: hoverTextColor }"
      >
        {{ label }}
      </a>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconClass: string // ex: 'fas fa-envelope' ou 'fab fa-linkedin-in'
  label: string // ex: 'bombokoraissa@gmail.com'
  href: string // ex: 'mailto:bombokoraissa@gmail.com'
  hoverColor?: string // ex: '#0a66c2'
  hoverTextColor?: string // ex: '#0a66c2'
}>()
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  background-color: white;
  height: 50px;
  border-radius: 50px;
  padding: 0 16px;
  margin: 12px 0;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}

.s-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}

.s-icon i {
  font-size: 20px;
  color: #000;
  transition: color 0.3s ease-in-out;
}

.button:hover .s-icon i {
  color: #fff;
}
</style>
