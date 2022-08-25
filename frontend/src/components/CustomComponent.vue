<script lang="ts">
import { defineComponent } from "vue";
// @ts-ignore
import { compile, h } from "vue/dist/vue.esm-bundler.js";
import kt from "./kt.vue"
export default defineComponent({
	props: {
		src: {
			type: String,
			required: false,
			default: "",
		},
	},
	components: {
		kt,
	},
	// @ts-ignore
	render() {
		// @ts-ignore
		return h(compile(this.src))
	}


});
</script>
