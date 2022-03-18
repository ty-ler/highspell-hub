import type {
	ConversationResult,
	ConversationOptionRequirement
} from 'src/interfaces/game/conversation';

export const walkConversationForRequirement = (
	result: ConversationResult,
	matchCb: (r: ConversationOptionRequirement) => boolean
) => {
	const { options } = result;
	if (!options) return null;
	for (let i = 0; i < options.length; i++) {
		const option = options[i];
		const { requirements } = option;

		if (!requirements || requirements.length === 0) continue;

		// Look for matching item ID in requirements
		const match = requirements.find((r) => matchCb(r));
		if (match) return match;
		else if (!match && option.result) {
			const res = walkConversationForRequirement(option.result, matchCb);
			if (res) return res;
		}
	}

	return null;
};
