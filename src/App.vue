<template class="body">
      <header>
        <div class="menu">
        <MenuComponent v-if="!$route.meta.hideMenu"></MenuComponent>
    </div>
      </header>
    <br><br><br>
    <div class="views">
        <router-view />
    </div>
    <br><br><br>
    <FooterComponent></FooterComponent>
</template>

<script>
import FooterComponent from "@/components/footer/FooterComponent"
import MenuComponent from "./components/menu/MenuComponent.vue";
export default {
    data() {
        return {

        }

    },

    components: {
        FooterComponent: FooterComponent,
        MenuComponent: MenuComponent
    }
}
</script>

<style>
body {
    font-family: 'montserrat', sans-serif;
    background-color: rgba(234, 234, 234, 1) !important;

}

.menu {
    z-index: 9999999;
    position: fixed;
    width: 100%;
    margin-top: 0;
}
.views {
    margin-top: 1rem;
}

.footer {
    position: absolute;
}

header {
    width: 100vw;
    margin-top: 0;
    background-color: var( --dark-color);
    padding: 0px;
}
</style>