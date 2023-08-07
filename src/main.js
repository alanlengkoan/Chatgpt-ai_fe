import { createApp } from 'vue'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faBars, faPaperPlane, faArrowLeft, faSearch, faPlus, faEnvelope, faLock, faUsers, faMessage, faUserGroup, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faBots } from '@fortawesome/free-brands-svg-icons'

import App from './App.vue'
import router from './router'

/* add icons to the library */
library.add(faBars, faPaperPlane, faArrowLeft, faSearch, faPlus, faEnvelope, faLock, faUsers, faMessage, faUserGroup, faHouse, faBots)

import './assets/css/index.css'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')