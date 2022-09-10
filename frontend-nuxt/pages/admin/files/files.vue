<template>
	<div>
		<form>
			<fieldset>
				<legend>Article</legend>
				<label for="image">Image:</label>
				<input type="file" placeholder="Image" name="image" id="file" />
				<button type="button" class="btn btn-pink" @click="post">Post</button>
				<p>Résultat: <code>{{  result  }}</code> <button type="button" class="btn btn-pink " @click="copy">Copy
						result</button>
				</p>
			</fieldset>
		</form>

	</div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'admin-dashboard',
	data() {
		return {
			result: 'Please upload file',
		}
	},
	methods: {
		async post() {
			const body = new FormData();
			const file = (document.getElementById("file") as HTMLInputElement).files![0]
			if (!file) {
				return;
			}
			body.append("file", file);

			const responce = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/cdn/image`, {
				method: "POST",
				credentials: "include",
				body: body,
			});
			const result = await responce.json();
			if (result.status === "success") {
				this.result = `${import.meta.env.VITE_BASE_API}/static${result.result}`;
			}
		},
		copy() {
			navigator.clipboard.writeText(this.result)
		}
	}
});
</script>