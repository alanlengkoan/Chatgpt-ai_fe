<template>
  <div class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 border-r z-30" id="main-nav">
    <div class="w-full h-20 border-b flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">LOGO</p>
    </div>

    <div class="mb-4 px-4">
      <a v-for="item in navigation" :key="item.name" :href="item.href"
        class="w-full flex items-center text-blue-400 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <font-awesome-icon class="h-6 w-6 fill-current mr-2" :icon="item.icon" />
        <span class="text-gray-700">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
  const navigation = [{
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'fa-solid fa-house',
    },
    {
      name: 'User',
      href: '/admin/user',
      icon: 'fa-solid fa-users'
    },
    {
      name: 'Chat',
      href: '/admin/chat',
      icon: 'fa-solid fa-message'
    },
    {
      name: 'Group',
      href: '/admin/group',
      icon: 'fa-solid fa-user-group'
    },
    {
      name: 'Bot',
      href: '/admin/bot',
      icon: 'fa-brands fa-bots'
    },
  ]
</script>

<script>
export default {
    name: 'Sidebar',
}
</script>