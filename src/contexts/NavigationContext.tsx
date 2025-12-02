import React, {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useReducer,
} from "react";

/**
 * Navigation page indices
 * 0 = Home
 * 1 = Settings
 */
export type PageIndex = 0 | 1;

/**
 * Navigation state for the app
 */
export interface NavigationState {
	/** Current page index (0 = Home, 1 = Settings) */
	currentPage: PageIndex;
	/** Whether search mode is active (search results replace main grid) */
	searchMode: boolean;
	/** Whether document filter mode is active */
	documentMode: boolean;
}

/**
 * Navigation actions
 */
export type NavigationAction =
	| { type: "SET_PAGE"; payload: PageIndex }
	| { type: "TOGGLE_SEARCH_MODE" }
	| { type: "ACTIVATE_SEARCH_MODE" }
	| { type: "DEACTIVATE_SEARCH_MODE" }
	| { type: "TOGGLE_DOCUMENT_MODE" }
	| { type: "ACTIVATE_DOCUMENT_MODE" }
	| { type: "DEACTIVATE_DOCUMENT_MODE" };

/** Initial navigation state */
const initialState: NavigationState = {
	currentPage: 0, // Start at Home page
	searchMode: false,
	documentMode: false,
};

/**
 * Navigation reducer
 */
function navigationReducer(
	state: NavigationState,
	action: NavigationAction,
): NavigationState {
	switch (action.type) {
		case "SET_PAGE":
			return {
				...state,
				currentPage: action.payload,
				// Close search mode when switching pages
				searchMode: false,
			};

		case "TOGGLE_SEARCH_MODE":
			return {
				...state,
				searchMode: !state.searchMode,
			};

		case "ACTIVATE_SEARCH_MODE":
			return {
				...state,
				searchMode: true,
			};

		case "DEACTIVATE_SEARCH_MODE":
			return {
				...state,
				searchMode: false,
			};

		case "TOGGLE_DOCUMENT_MODE":
			// If we're on Settings page, navigate to Home and activate document mode
			// If we're on Home page, just toggle document mode
			if (state.currentPage === 1) {
				return {
					...state,
					currentPage: 0,
					// documentMode: true,
				};
			}
			return {
				...state,
				documentMode: !state.documentMode,
			};

		case "ACTIVATE_DOCUMENT_MODE":
			// Always navigate to Home when activating document mode
			return {
				...state,
				currentPage: 0,
				documentMode: true,
			};

		case "DEACTIVATE_DOCUMENT_MODE":
			return {
				...state,
				documentMode: false,
			};

		default:
			return state;
	}
}

/**
 * Navigation context type
 */
interface NavigationContextType {
	state: NavigationState;
	dispatch: React.Dispatch<NavigationAction>;
	/** Helper: Navigate to Home page */
	goToHome: () => void;
	/** Helper: Navigate to Settings page */
	goToSettings: () => void;
	/** Helper: Toggle search mode */
	toggleSearch: () => void;
	/** Helper: Toggle document mode */
	toggleDocuments: () => void;
}

/** Create navigation context */
const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined,
);

/**
 * Navigation provider component
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(navigationReducer, initialState);

	// Helper functions for common actions
	const goToHome = useCallback(() => {
		dispatch({ type: "SET_PAGE", payload: 0 });
	}, []);

	const goToSettings = useCallback(() => {
		dispatch({ type: "SET_PAGE", payload: 1 });
	}, []);

	const toggleSearch = useCallback(() => {
		dispatch({ type: "TOGGLE_SEARCH_MODE" });
	}, []);

	const toggleDocuments = useCallback(() => {
		dispatch({ type: "TOGGLE_DOCUMENT_MODE" });
	}, []);

	const value: NavigationContextType = {
		state,
		dispatch,
		goToHome,
		goToSettings,
		toggleSearch,
		toggleDocuments,
	};

	return (
		<NavigationContext.Provider value={value}>
			{children}
		</NavigationContext.Provider>
	);
}

/**
 * Custom hook to use navigation context
 */
export function useNavigation() {
	const context = useContext(NavigationContext);
	if (context === undefined) {
		throw new Error("useNavigation must be used within a NavigationProvider");
	}
	return context;
}
