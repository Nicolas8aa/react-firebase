import { createStore } from "redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        userEmail: action.userEmail,
        userId: action.userId,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        userEmail: "",
        userId: "",
      };
    }
    default:
      return state;
  }
};

//const store = createStore(reducer, [preloadedState], [enhancer]);
