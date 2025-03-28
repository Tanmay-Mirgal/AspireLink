import { Router } from "express"
import { 
    createPost, 
    deletePost, 
    getAllPost, 
    getPostById,
    updatePost,
    likePost,
    addComment,
    deleteComment
} from "../controllers/post.controller.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(protectedRoute)

router.post('/create-post', createPost)
router.get('/all-posts', getAllPost)
router.get('/:id', getPostById)
router.put('/update/:id', updatePost)
router.delete('/delete/:id', deletePost)
router.post('/like/:id', likePost)
router.post('/:id/comment', addComment)
router.delete('/:id/comment/:commentId', deleteComment)


export default router