import { defineStore } from 'pinia'

export const useKeycloak = defineStore('keycloak', () => {
    const keycloak = ref<any>(null)

    function setup(kc:any) {
        keycloak.value = kc
    }

    function isSet() {
        return keycloak.value != null
    }

    return { keycloak, setup, isSet }
})