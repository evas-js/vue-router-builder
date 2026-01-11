<template>
    <nav v-if="links?.length" class="page-nav">
        <router-link v-for="{ path, meta } in links" :key="path" :to="path" class="page-nav-link">
            {{ meta.title }}
        </router-link>
    </nav>
</template>

<script>
export default {
    props: {
        links: { type: Array, default: null}
    },
    // computed: {
    //     links() {
    //         console.log(this.$route)
    //         return (this.$route?.matched?.at(0)?.children || []).filter(child => child.meta)
    //     },
    // },
}
</script>
