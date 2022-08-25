<script lang="ts">
import { defineComponent } from "vue";
// @ts-ignore
import { compile, h } from "vue/dist/vue.esm-bundler.js";
export default defineComponent({
	props: {
		src: {
			type: String,
			required: false,
			default: "",
		},
	},
	// @ts-ignore
	render() {
		// @ts-ignore
		return h(compile(this.src))
	}


});
</script>
