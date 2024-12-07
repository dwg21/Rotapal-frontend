export interface UserData {
  business: string;
  name: string;
  role: string;
  userId: string;
}

export interface UserState {
  loggedIn: boolean;
  userData: UserData | null;
}
