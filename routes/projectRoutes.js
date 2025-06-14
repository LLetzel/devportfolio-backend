const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { createProject, getMyProjects, updateProject, deleteProject,getAllProjects, getProjectById} = require('../controllers/projectController');

router.post('/', auth, upload.single('imagem'), createProject); // ok
router.get('/', auth, getAllProjects); // ok
router.get('/myprojects', auth, getMyProjects); // ok
router.put('/:id', auth, upload.single('imagem'), updateProject);
router.delete('/:id', auth, deleteProject);
router.get('/project/:id', auth, getProjectById); // ok

module.exports = router;
