<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" type="email" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>
