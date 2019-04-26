import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger.js";

import mutations from "./mutations.js";
import state from "./state.js";
import * as actions from './actions.js';
import * as getters from './getters.js';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    actions,
    getters,
    mutations,
    state,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})