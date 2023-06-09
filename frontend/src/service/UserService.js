import axios from "../axios";

export const UserService = {
  getUserInfo: function (username) {
    return axios.get(`api/user/${username}`);
  },

  getUserByKeyword: function (keyword) {
    return axios.get(`api/user/search/${keyword}`);
  },
};
