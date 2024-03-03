export const load = async ({ locals }) => {
	const authedUser = await locals.getAuthedUser();

	console.log('AUTHED USER => ', authedUser);

	// console.log('AUTHED USER => ', data, error, status);
	// const { data, error, status } = await parseApiResponse(locals.api.users.$get());
	// if (error) {
	// 	console.log('ERROR => ', error, status);
	// 	return { users: null };
	// }

	return { users: [] };
};
