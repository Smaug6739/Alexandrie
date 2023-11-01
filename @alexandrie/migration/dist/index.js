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


Old categories:
10247724590960640,Chimie (Acides & Oxydoréduction)
135688451642101760,Optique
1563846779080705,Général
1564500943704066,Nombres
1564753356918787,Algèbre
1564854359953412,Analyse
1564994986577925,Géométrie
1565265611460614,Probabilités et statistiques
1565634844430343,Algorithmie
38224311751806976,Information
3993900674977792,Général
4030806225850368,Matière
4031642125471745,Énergie
44031625821949952,Ondes
51632421858185216,Réseaux
59881276756201472,Raisonnement
61787697525559296,Environnement
8124080637087744,Général
8124501086703617,Modélisation de systèmes
9154132401197056,Mécanique

*/
import { createPool } from 'mysql2';
function getConnection(host, user, password, db_name) {
    return createPool({
        host: host,
        user: user,
        password: password,
        database: db_name,
    });
}
const old_db = getConnection('localhost', 'root', 'root', 'docs');
const new_db = getConnection('localhost', 'root', 'root', 'alexandrie');
function getAllOldArticles() {
    return new Promise(resolve => {
        old_db.query('SELECT * FROM articles', (err, result) => {
            if (err)
                console.log(err);
            resolve(result);
        });
    });
}
function formatArticleToDocument(article) {
    return {
        id: article.id,
        name: article.name,
        description: article.description,
        tags: '',
        category: getNewCategoryID(article.main_category),
        accessibility: 1,
        content_markdown: article.content_markdown,
        content_html: article.content_html,
        author_id: '152981937240150016',
        created_timestamp: article.created_timestamp,
        updated_timestamp: article.updated_timestamp,
    };
}
// With the old category id return the new category id
function getNewCategoryID(old_id) {
    switch (old_id) {
        case '10247724590960640':
            return '153009590005403656';
        case '135688451642101760':
            return '153009590005403651';
        case '1563846779080705':
            return '153009357737431040';
        case '1564500943704066':
            return '153009357787762689';
        case '1564753356918787':
            return '153009357787762690';
        case '1564854359953412':
            return '153009357787762691';
        case '1564994986577925':
            return '153009357787762692';
        case '1565265611460614':
            return '153009357787762692';
        case '1565634844430343':
            return '153009590005403648';
        case '38224311751806976':
            return '153009590005403649';
        case '3993900674977792':
            return '153009590005403650';
        case '4030806225850368':
            return '153009590005403651';
        case '4031642125471745':
            return '153009590005403652';
        case '44031625821949952':
            return '153009590005403653';
        case '51632421858185216':
            return '153009590005403654';
        case '59881276756201472':
            return '153009590005403655';
        case '61787697525559296':
            return '153009590005403656';
        case '8124080637087744':
            return '153009590005403648';
        case '8124501086703617':
            return '153009590005403648';
        case '9154132401197056':
            return '153009590005403652';
        default:
            return '153009357737431040';
    }
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
        new_db.query('INSERT INTO documents (`id`, `name`, `description`, `tags`, `category`, `accessibility`, `content_markdown`, `content_html`, `author_id`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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
        ], (err, result) => {
            if (err)
                console.log(err);
            console.log(`Inserted document ${document.name}.`);
            resolve(result);
        });
    });
}
console.log('Migration finished.');
new_db.end();
old_db.end();
//# sourceMappingURL=index.js.map