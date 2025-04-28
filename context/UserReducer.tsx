import { UserType } from "./UserContext";

export type ActionType =
  | { type: "SET_USER"; payload: UserType }
  | { type: "CLEAR_USER" };

export default function UserReducer(
  state: { user: UserType },
  action: ActionType
): { user: UserType } {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload };
    case "CLEAR_USER":
      return { user: null };
    default:
      return state;
  }
}
