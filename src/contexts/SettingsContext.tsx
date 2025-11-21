import React, {
	createContext,
	type ReactNode,
	useContext,
	useReducer,
} from "react";

/* AI-INSTRUCTION-START:settings-context
 * This is the Settings Context for managing app-wide settings.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Add your app-specific settings to SettingsState interface
 * 2. Create actions for each setting that can be modified
 * 3. Implement reducer cases for your custom actions
 * 4. Update initialState with your default values
 *
 * Common settings to consider:
 * - Notifications preferences
 * - Language/locale
 * - App-specific feature toggles
 * - User preferences
 *
 * OpenSpec Reference: specs/state-management/spec.md
 * AI Instructions: openspec/ai-instructions/context-creation.md
 * AI-INSTRUCTION-END */

// Theme options
export type Theme = "light" | "dark" | "system";

// User preferences
export interface UserPreferences {
	onboardingCompleted: boolean;
	/* AI-INSTRUCTION-START:user-preferences
	 * Add your custom user preferences here:
	 * Example:
	 * - notifications: boolean
	 * - language: string
	 * - autoSave: boolean
	 * AI-INSTRUCTION-END */
}

// Settings state
export interface SettingsState {
	theme: Theme;
	preferences: UserPreferences;
	loading: boolean;
	error: string | null;
	/* AI-INSTRUCTION-START:settings-state
	 * Add your custom settings here:
	 * Example:
	 * - soundEnabled: boolean
	 * - dataSync: boolean
	 * AI-INSTRUCTION-END */
}

// Settings actions
export type SettingsAction =
	| { type: "SET_THEME"; payload: Theme }
	| { type: "SET_ONBOARDING_COMPLETED"; payload: boolean }
	| { type: "SET_PREFERENCES"; payload: UserPreferences }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "RESET_SETTINGS" };
	/* AI-INSTRUCTION-START:settings-actions
	 * Add your custom actions here:
	 * Example:
	 * | { type: 'TOGGLE_NOTIFICATIONS' }
	 * | { type: 'SET_LANGUAGE'; payload: string }
	 * AI-INSTRUCTION-END */

// Initial state
const initialState: SettingsState = {
	theme: "system",
	preferences: {
		onboardingCompleted: false,
	},
	loading: false,
	error: null,
};

// Reducer function
function settingsReducer(
	state: SettingsState,
	action: SettingsAction,
): SettingsState {
	switch (action.type) {
		case "SET_THEME":
			return {
				...state,
				theme: action.payload,
			};

		case "SET_ONBOARDING_COMPLETED":
			return {
				...state,
				preferences: {
					...state.preferences,
					onboardingCompleted: action.payload,
				},
			};

		case "SET_PREFERENCES":
			return {
				...state,
				preferences: action.payload,
			};

		case "SET_LOADING":
			return {
				...state,
				loading: action.payload,
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
				loading: false,
			};

		case "RESET_SETTINGS":
			return {
				...initialState,
				preferences: {
					...initialState.preferences,
					onboardingCompleted: state.preferences.onboardingCompleted,
				},
			};

		/* AI-INSTRUCTION-START:settings-reducer-cases
		 * Add reducer cases for your custom actions here:
		 * Example:
		 * case 'TOGGLE_NOTIFICATIONS':
		 *   return {
		 *     ...state,
		 *     preferences: {
		 *       ...state.preferences,
		 *       notifications: !state.preferences.notifications,
		 *     },
		 *   };
		 * AI-INSTRUCTION-END */

		default:
			return state;
	}
}

// Context type
interface SettingsContextType {
	state: SettingsState;
	dispatch: React.Dispatch<SettingsAction>;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

// Provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(settingsReducer, initialState);

	/* AI-INSTRUCTION-START:settings-provider-logic
	 * Add any initialization logic or side effects here:
	 * - Load settings from storage on mount
	 * - Persist settings changes to storage
	 * - Sync settings across app
	 * AI-INSTRUCTION-END */

	return (
		<SettingsContext.Provider value={{ state, dispatch }}>
			{children}
		</SettingsContext.Provider>
	);
}

// Custom hook to use settings context
export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
