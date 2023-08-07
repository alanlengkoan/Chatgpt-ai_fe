<script setup>
import Sidebar from '../components/admin/Sidebar.vue';
import Navbar from '../components/admin/Navbar.vue';
import Footer from '../components/admin/Footer.vue';
</script>

<template>
    <div class="leading-normal tracking-normal" id="main-body">
        <div class="flex flex-wrap">
            <!-- begin:: sidebar -->
            <Sidebar />
            <!-- end:: sidebar -->

            <div class="w-full bg-gray-100 pl-0 lg:pl-64 min-h-screen" id="main-content">
                <!-- begin:: navbar -->
                <Navbar />
                <!-- end:: navbar -->
            
                <!-- begin:: content -->
                <div class="h-screen p-6 bg-gray-100 mb-20">
                    <RouterView />
                </div>
                <!-- end:: content -->
            
                <!-- begin:: footer -->
                <Footer />
                <!-- end:: footer -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseAdmin',
}
</script>