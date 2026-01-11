<template>
    <GroupPageNav v-if="links?.length" :links="links" />
    <router-view></router-view>
</template>

<script>
import GroupPageNav from './GroupPageNav.vue'
export default {
    props: {
        links: { type: Array, default: null },
    },
    components: { GroupPageNav },
}
</script>
