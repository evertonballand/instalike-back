import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { listPosts, createNewPost, uploadImg, updatePost } from '../controllers/postsController.js';

const corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200
}

const upload = multer({dest:'./uploads'});

const routes = (app) => {
  // Permite que o servidor interprete corpos de requisições no formato JSON
  app.use(express.json());

  app.use(cors(corsOptions));

  // Rota para recuperar uma lista de todos os posts
  app.get('/posts', listPosts);
  // Rota para criar um post
  app.post('/posts', createNewPost);
  //Rota para fazer upload de um arquivo de imagem
  app.post('/upload', upload.single('imagem'), uploadImg);
  //Rota para atualizar um registro que já existe
  app.put('/upload/:id', updatePost);
}

export default routes;