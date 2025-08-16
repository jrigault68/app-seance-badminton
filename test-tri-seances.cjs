// Script de test pour vérifier le tri des séances par date de modification
const https = require('https');
const http = require('http');

async function testTriSeances() {
  try {
    console.log('🔍 Test du tri des séances par date de modification...');
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:5000/seances?limit=10', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });
    
    if (!response.seances || response.seances.length === 0) {
      console.log('❌ Aucune séance trouvée');
      return;
    }
    
    console.log(`✅ ${response.seances.length} séances récupérées`);
    console.log('\n📋 Liste des séances (triées par updated_at décroissant) :');
    console.log('─'.repeat(80));
    
    response.seances.forEach((seance, index) => {
      const updatedAt = new Date(seance.updated_at).toLocaleString('fr-FR');
      console.log(`${index + 1}. ${seance.nom} (modifiée le ${updatedAt})`);
    });
    
    // Vérification que le tri est correct
    let triCorrect = true;
    for (let i = 1; i < response.seances.length; i++) {
      const prevDate = new Date(response.seances[i - 1].updated_at);
      const currentDate = new Date(response.seances[i].updated_at);
      if (prevDate < currentDate) {
        triCorrect = false;
        console.log(`❌ Erreur de tri : ${response.seances[i - 1].nom} (${prevDate}) devrait être après ${response.seances[i].nom} (${currentDate})`);
      }
    }
    
    if (triCorrect) {
      console.log('\n✅ Le tri par date de modification fonctionne correctement !');
    } else {
      console.log('\n❌ Le tri par date de modification ne fonctionne pas correctement.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error.message);
  }
}

testTriSeances();
