
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost } from './services/api';
import './App.css';

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const postsPerPage = 10;

  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.setQueryData(['posts'], (old = []) => [
        { ...newPost, id: Date.now() },
        ...old,
      ]);
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, post }) => updatePost(id, post),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (old = []) =>
        old.map((post) =>
          post.id === editingPost.id
            ? { ...post, ...updatedPost, id: editingPost.id }
            : post
        )
      );
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (id) => {
      queryClient.setQueryData(['posts'], (old = []) =>
        old.filter((post) => post.id !== id)
      );
    },
  });

  function closeForm() {
    setShowForm(false);
    setEditingPost(null);
    setTitle('');
    setBody('');
  }

  function openEdit(post) {
    setEditingPost(post);
    setTitle(post.title);
    setBody(post.body);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const postData = { title, body, userId: 1 };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, post: postData });
    } else {
      createMutation.mutate(postData);
    }
  }

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.body}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  if (isLoading) return <div className="status">Loading posts...</div>;
  if (isError) return <div className="status">Could not load posts. Please refresh.</div>;

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <span className="eyebrow">CONTENT MANAGEMENT</span>
          <h1>Post Dashboard</h1>
          <p>Manage and organise your posts in one place.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Create Post
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Posts</span>
          <strong>{posts.length}</strong>
        </div>
        <div className="stat-card">
          <span>Search Results</span>
          <strong>{filteredPosts.length}</strong>
        </div>
        <div className="stat-card">
          <span>Current Page</span>
          <strong>{totalPages ? page : 0} / {totalPages}</strong>
        </div>
      </section>

      <section className="content">
        <div className="content-heading">
          <div>
            <h2>All Posts</h2>
            <p>Browse, search, edit or remove posts.</p>
          </div>
          <input
            className="search"
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {currentPosts.length === 0 ? (
          <p className="empty">No posts found.</p>
        ) : (
          <div className="post-grid">
            {currentPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <span className="post-number">POST #{post.id}</span>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => openEdit(post)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm('Delete this post?')) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {totalPages ? page : 0} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <form className="post-form" onSubmit={handleSubmit}>
            <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>

            <label>Post Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
            />

            <label>Post Content</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows="5"
              placeholder="Write your post..."
            />

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeForm}>
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingPost ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;
