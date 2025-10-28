<template>
  <NuxtLayout name="admin" v-slot="{ activeTab }">
    <div>
      <AdminProjects v-if="activeTab === 'projects'" />
      <AdminSkills v-if="activeTab === 'skills'" />
      <AdminExperiences v-if="activeTab === 'experiences'" />
      <AdminMessages v-if="activeTab === 'messages'" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminSkills from '@/components/admin/AdminSkills.vue'
import AdminExperiences from '@/components/admin/AdminExperiences.vue'
import AdminMessages from '@/components/admin/AdminMessages.vue'
</script>
