import fs from 'fs';
import { getAllPosts, createPost, updateNewPost } from '../models/postsModel.js';
import gerarDescricaoComGemini from '../services/geminiService.js';

export async function listPosts (req, res) {
  // Chama a função para buscar os posts
  const posts = await getAllPosts();
  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
};

// Função assíncrona que lida com a criação de um novo post
export async function createNewPost (req, res) {
  // Obtém os dados do novo post a partir do corpo da requisição
  const newPost = req.body;
  try {
    // Chama a função createPost para inserir um novo post no banco de dados e aguarda a conclusão da operação
    const createdPost = await createPost(newPost);
    // Envia uma resposta HTTP com status 200 e o objeto do post recém-criado em formato JSON
    res.status(200).json(createdPost);
  } catch(erro) {
    // Loga a mensagem de erro no console em caso de falha na criação do post
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 e uma mensagem de erro em formato JSON em caso de falha na criação do post
    res.status(500).json({'Erro':'Falha na requisição'});
  }
}
// Função assíncrona que lida com o upload de imagem e a criação de um novo post
export async function uploadImg(req, res) {
  const newPost = {
      description: "",
      imgUrl: req.file.originalName,
      alt: ""
  };
  try {
    // Chama a função createPost para inserir um novo post no banco de dados e aguarda a conclusão da operação
    const createdPost = await createPost(newPost);
    // Define o caminho para a imagem do post recém-criado, utilizando o ID do post inserido
    const updateImg = `uploads/${createdPost.insertedId}.png`;
    // Renomeia o arquivo de imagem enviado para o caminho definido, utilizando o ID do post recém-criado
    fs.renameSync(req.file.path, updateImg);
    // Envia uma resposta HTTP com status 200 e o objeto do post recém-criado em formato JSON
    res.status(200).json(createdPost);
  } catch(erro) {
    // Loga a mensagem de erro no console em caso de falha na criação do post
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 e uma mensagem de erro em formato JSON em caso de falha na criação do post
    res.status(500).json({'Erro':'Falha na requisição'});
  }
}

export async function updatePost (req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
    const description = await gerarDescricaoComGemini(imageBuffer)
    const post = {
      imgUrl: urlImagem,
      description: description,
      alt: req.body.alt
    }
    const createdPost = await updateNewPost(id, post);
    res.status(200).json(createdPost);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({'Erro':'Falha na requisição'});
  }
}