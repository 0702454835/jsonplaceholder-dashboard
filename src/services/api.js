// Base URL of the JSONPlaceholder API
const API_URL = "https://jsonplaceholder.typicode.com";

// GET: Fetch all posts,GET retrieves data,fetch sends a request to the API
export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();// Converts the API response into JavaScript data
};

// POST: Create a new post
export const createPost = async (post) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

// PUT: Update an existing post
export const updatePost = async (id, post) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

// DELETE: Delete a post
export const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return id;
};