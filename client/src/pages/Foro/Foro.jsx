import { useState, useEffect } from 'react';
import { foroService } from '../../services/foroService';
import './Foro.css';

function Foro() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState({
        content: '',
        category: 'general',
        tags: []
    });
    const [showComments, setShowComments] = useState({});
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        cargarPosts();
    }, []);

    const cargarPosts = async () => {
        try {
            setLoading(true);
            const data = await foroService.getAllPosts();
            setPosts(data);
        } catch (error) {
            setError('Error al cargar las publicaciones: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await foroService.createPost(newPost);
            setNewPost({
                content: '',
                category: 'general',
                tags: []
            });
            await cargarPosts();
        } catch (error) {
            alert('Error al crear la publicación: ' + error.message);
        }
    };

    const handleLike = async (postId) => {
        try {
            await foroService.likePost(postId);
            await cargarPosts();
        } catch (error) {
            alert('Error al dar me gusta: ' + error.message);
        }
    };

    const handleComment = async (postId) => {
        try {
            if (!newComment[postId]) return;
            await foroService.addComment(postId, newComment[postId]);
            setNewComment(prev => ({ ...prev, [postId]: '' }));
            await cargarPosts();
        } catch (error) {
            alert('Error al comentar: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <div className="foro-container">
                <div className="loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Cargando publicaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="foro-container">
                <div className="error">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                    <button onClick={cargarPosts} className="btn-reintentar">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="foro-container">
            <h1>Foro de la Comunidad</h1>
            
            <div className="nuevo-post">
                <h2>Crear Nueva Publicación</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="¿Qué quieres compartir con la comunidad?"
                        rows="4"
                        required
                    />
                    <div className="post-options">
                        <select
                            value={newPost.category}
                            onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                            required
                        >
                            <option value="general">General</option>
                            <option value="cultivos">Cultivos</option>
                            <option value="mercado">Mercado</option>
                            <option value="tecnologia">Tecnología</option>
                        </select>
                        <button type="submit" className="btn-publicar">
                            Publicar
                        </button>
                    </div>
                </form>
            </div>

            <div className="posts-lista">
                <h2>Publicaciones Recientes</h2>
                {posts.length === 0 ? (
                    <p className="no-posts">No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="post-item">
                            <div className="post-header">
                                <div className="post-info">
                                    <span className="post-category">{post.category}</span>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                            <p className="post-content">{post.content}</p>
                            {post.images && post.images.length > 0 && (
                                <div className="post-images">
                                    {post.images.map((image, index) => (
                                        <img key={index} src={image} alt={`Imagen ${index + 1}`} />
                                    ))}
                                </div>
                            )}
                            {post.tags && post.tags.length > 0 && (
                                <div className="post-tags">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="post-actions">
                                <button 
                                    className={`btn-like ${post.likes?.includes(post.author) ? 'liked' : ''}`}
                                    onClick={() => handleLike(post._id)}
                                >
                                    <i className="fas fa-heart"></i>
                                    {post.likes?.length || 0} Me gusta
                                </button>
                                <button 
                                    className="btn-comment"
                                    onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                                >
                                    <i className="fas fa-comment"></i>
                                    {post.comments?.length || 0} Comentarios
                                </button>
                            </div>
                            
                            {showComments[post._id] && (
                                <div className="comments-section">
                                    {post.comments?.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <p>{comment.content}</p>
                                            <span className="comment-date">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="new-comment">
                                        <textarea
                                            value={newComment[post._id] || ''}
                                            onChange={(e) => setNewComment(prev => ({ 
                                                ...prev, 
                                                [post._id]: e.target.value 
                                            }))}
                                            placeholder="Escribe un comentario..."
                                            rows="2"
                                        />
                                        <button 
                                            onClick={() => handleComment(post._id)}
                                            disabled={!newComment[post._id]}
                                        >
                                            Comentar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Foro; 