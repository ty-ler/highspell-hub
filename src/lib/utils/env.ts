export const isProduction = () => {
	return import.meta.env.VITE_PRODUCTION === '1';
};
