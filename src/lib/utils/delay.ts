export const delay = (time: number = 0) =>
	new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
