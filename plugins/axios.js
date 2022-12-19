
export default ({ app, $axios, store }) => {
    $axios.onRequest(config => {
        store.commit('SET_ACCESS',true);
    })
    $axios.onError(error => {
        if(error.response.status == 403){
            store.commit('SET_ACCESS',false);
        }
        if(error.response.status == 401){
            app.$auth.logout().then(() => app.router.push({
                path: '/login'
            })
            );
            
        }
        
    })
}