export const API = "https://api.com";

export const VALID = {
  id: "SOME_ID",
  username: "SOME_USERNAME",
  email: "someemail@gmail.com",
  address: {
    street: "ABC123 St.",
  },
  followers: [{ id: "SOME_ID" }, { id: "SOME_ID", role: "admin" }],
};

export const INVALID = {
  id: "SOME_ID",
  username: "SOME_USERNAME",
  address: "ABC123 St.",
  followers: [],
};
