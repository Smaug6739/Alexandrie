/*
New categories:
153009357737431040,Général (Maths)
153009357787762689,Algèbre
153009357787762690,Analyse
153009357787762691,Géométrie
153009357787762692,Probabilités et statistiques
153009357791956997,Raisonnements
153009590005403648,Algorithmie
153009590005403649,Général (Physique)
153009590005403650,Énergie
153009590005403651,Optique
153009590005403652,Matière
153009590005403653,Ondes
153009590005403654,Mécanique
153009590005403655,Acides & Bases
153009590005403656,Oxydoréduction
153009590005403657,Général (Ingénierie)
153009590005403658,Informations
153009590005403659,Réseaux
153009590005403660,Modélisation de systèmes


Old categories: (name, id)
Général,general
Nombres,nombres
Algèbres,algebres
Analyse,analyse
Géométrie,geometrie
Probabilités et statistiques,probalitites-et-statistiques
Algorithmie,algorithmie
Information,information
Général,general
Matière,matiere
Énergie,energie
Ondes,ondes
Réseaux,reseaux
Général,general
Modélisation de systèmes,modelisation
Mécanique,mecanique


*/
function getNewCategoryID(old_id: string): string {
  switch (old_id) {
    case 'general':
      return '153009357737431040'; // Général (Maths)
    case 'nombres':
      return '153009357787762689'; // You can specify a default value for unknown old IDs
    case 'algebres':
      return '153009357787762689'; // Algèbre
    case 'analyse':
      return '153009357787762690'; // Analyse
    case 'geometrie':
      return '153009357787762691'; // Géométrie
    case 'probalitites-et-statistiques':
      return '153009357787762692'; // Probabilités et statistiques
    case 'algorithmie':
      return '153009590005403648'; // Algorithmie
    case 'information':
      return '153009590005403658'; // Informations
    case 'matiere':
      return '153009590005403652'; // Matière
    case 'energie':
      return '153009590005403650'; // Énergie
    case 'ondes':
      return '153009590005403653'; // Ondes
    case 'reseaux':
      return '153009590005403659'; // Réseaux
    case 'modelisation':
      return '153009590005403660'; // Modélisation de systèmes
    case 'mecanique':
      return '153009590005403654'; // Mécanique
    default:
      return '153009590005403662'; // You can specify a default value for unknown old IDs
  }
}
import { type Pool, createPool } from 'mysql2';
import type { Article, ArticleDB, Document, DocumentDB } from './types';

function getConnection(host?: string, user?: string, password?: string, db_name?: string) {
  return createPool({
    host: host,
    user: user,
    password: password,
    database: db_name,
  });
}

const old_db: Pool = getConnection('localhost', 'root', 'root', 'docs');
const new_db = getConnection('localhost', 'root', 'root', 'alexandrie');

function getAllOldArticles() {
  return new Promise<Article[]>(resolve => {
    old_db.query<ArticleDB[]>('SELECT * FROM articles', (err, result) => {
      if (err) console.log(err);
      resolve(result);
    });
  });
}
function formatArticleToDocument(article: Article): Document {
  return {
    id: article.id,
    name: article.name,
    description: article.description,
    tags: '',
    category: getNewCategoryID(article.sub_category),
    accessibility: 1,
    content_markdown: article.content_markdown,
    content_html: article.content_html,
    author_id: '152981937240150016',
    created_timestamp: article.created_timestamp,
    updated_timestamp: article.updated_timestamp,
  };
}

console.log('Starting migration...');

const articles = await getAllOldArticles();
console.log('Got all articles.');
const documents = articles.map(article => formatArticleToDocument(article));
console.log('Formatted all articles.');
console.log('Starting to insert documents...');
let i = 1;
for (const document of documents) {
  console.log(`Inserting document ${document.name}... (${i}/${documents.length})`);
  i++;
  await new Promise(resolve => {
    new_db.query<DocumentDB[]>(
      'INSERT INTO documents (`id`, `name`, `description`, `tags`, `category`, `accessibility`, `content_markdown`, `content_html`, `author_id`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        document.id,
        document.name,
        document.description,
        document.tags,
        document.category,
        document.accessibility,
        document.content_markdown,
        document.content_html,
        document.author_id,
        document.created_timestamp,
        document.updated_timestamp,
      ],
      (err, result) => {
        if (err) console.log(err);
        console.log(`Inserted document ${document.name}.`);
        resolve(result);
      },
    );
  });
}

console.log('Migration finished.');
new_db.end();
old_db.end();
