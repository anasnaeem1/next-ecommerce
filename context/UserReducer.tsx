import {
  UserType,
  NewProductType,
  NotificationType,
  ActionType,
} from "./UserContext";

type StateType = {
  user: UserType | null;
  newProduct: NewProductType | null;
  notification: NotificationType;
};

export default function UserReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "CLEAR_USER":
      return { ...state, user: null };

    case "SET_NEW_PRODUCT":
      return { ...state, newProduct: action.payload };

    case "SET_NOTIFICATION":
      return { ...state, notification: action.payload };

    case "CLEAR_NOTIFICATION":
      return { ...state, notification: null };

    default:
      return state;
  }
}

