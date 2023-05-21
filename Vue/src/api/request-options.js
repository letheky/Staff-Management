export const requestOptions = {
  get() {
    return {
      method: "GET",
      ...headers(),
    };
  },
  post() {
    return {
      method: "POST",
      ...headers(),
      // body: JSON.stringify(body),
    };
  },
  postBody(body) {
    return {
      method: "POST",
      ...headers(),
      body: JSON.stringify(body),
    };
  },
  postImage(body) {
    return {
      method: "POST",
      ...headerImages(),
      body: body,
    };
  },
  patch(body) {
    return {
      method: "PATCH",
      ...headers(),
      body: JSON.stringify(body),
    };
  },
  put(body) {
    return {
      method: "PUT",
      ...headers(),
      body: JSON.stringify(body),
    };
  },
  putImage(body) {
    return {
      method: "PUT",
      ...headerImages(),
      body: body,
    };
  },
  putNoBody() {
    return {
      method: "PUT",
      ...headers(),
    };
  },
  delete() {
    return {
      method: "DELETE",
      ...headers(),
    };
  },
};

function headers() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authHeader = currentUser?.user?.token
    ? { Authorization: "Bearer " + currentUser?.user?.token }
    : {};
  return {
    headers: {
      ...authHeader,
      "Content-Type": "application/json",
    },
  };
}

function headerImages() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authHeader = currentUser?.user?.token
    ? { Authorization: "Bearer " + currentUser?.user?.token }
    : {};
  return {
    headers: {
      ...authHeader,
      Accept: "multipart/form-data",
    },
  };
}
