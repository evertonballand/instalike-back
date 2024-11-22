import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados utilizando a string de conexão fornecida como variável de ambiente
const connection = await conectarAoBanco(process.env.STRING_CONNECTION);

// Função assíncrona para buscar todos os posts do banco de dados
export async function getAllPosts() {
    // Seleciona o banco de dados "imersao-instabyte"
    const db = connection.db("imersao-instabyte");
    // Seleciona a coleção "posts" dentro do banco de dados
    const postCollection = db.collection("posts");
    // Retorna um array com todos os documentos da coleção
    return postCollection.find().toArray();
}

// Função assíncrona para criar um novo post no banco de dados
export async function createPost(newPost) {
    // Seleciona o banco de dados "imersao-instabyte"
    const db = connection.db("imersao-instabyte");
    // Seleciona a coleção "posts" dentro do banco de dados
    const postCollection = db.collection("posts");
    // Insere o novo post na coleção e retorna o resultado da inserção
    return postCollection.insertOne(newPost);
}

export async function updateNewPost(id, newPost) {
    const db = connection.db("imersao-instabyte");
    const postCollection = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return postCollection.updateOne({_id: new ObjectId(objID)}, {$set: newPost});
}