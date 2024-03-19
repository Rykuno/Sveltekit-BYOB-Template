export const load = async ({ locals }) => {
	const authedUser = await locals.getAuthedUser();

	return { users: [] };
};
