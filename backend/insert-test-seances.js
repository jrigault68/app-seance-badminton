require('dotenv').config();
const supabase = require('./supabase');

async function insertTestSeances() {
  console.log('🧪 Insertion des séances de test...\n');

  const testSeances = [
    {
      id: 'seance-mobilite-debutant',
      nom: 'Mobilité pour débutant',
      description: 'Une séance douce pour améliorer votre mobilité articulaire et votre souplesse. Parfaite pour les débutants.',
      niveau_id: 1, // facile
      type_seance: 'mobilité',
      categories: ['mobilité', 'échauffement'],
      objectifs: [
        'Améliorer la mobilité articulaire',
        'Augmenter la souplesse générale',
        'Préparer le corps à l\'effort'
      ],
      duree_estimee: 25,
      calories_estimees: 120,
      materiel_requis: ['tapis de yoga'],
      structure: [
        {
          id: 'echauffement_marche_active',
          series: 1,
          temps_series: 300
        },
        {
          id: 'cercles_epaules_legers',
          series: 2,
          repetitions: 10
        },
        {
          id: 'mobilisation_cheville_gauche',
          series: 1,
          temps_series: 120
        },
        {
          id: 'ouverture_hanche_debout',
          series: 2,
          repetitions: 8
        },
        {
          id: 'respiration_allongee',
          series: 1,
          temps_series: 180
        }
      ],
      notes: 'Séance accessible à tous, même sans expérience sportive.',
      tags: ['débutant', 'mobilité', 'doux'],
      est_publique: true
    },
    {
      id: 'seance-renforcement-intermediaire',
      nom: 'Renforcement complet',
      description: 'Séance de renforcement musculaire complète pour tonifier l\'ensemble du corps.',
      niveau_id: 2, // intermédiaire
      type_seance: 'renforcement',
      categories: ['renforcement', 'gainage'],
      objectifs: [
        'Renforcer les muscles principaux',
        'Améliorer la stabilité',
        'Augmenter l\'endurance musculaire'
      ],
      duree_estimee: 45,
      calories_estimees: 280,
      materiel_requis: ['tapis de yoga'],
      structure: [
        {
          id: 'echauffement_marche_active',
          series: 1,
          temps_series: 300
        },
        {
          type: 'bloc',
          repetitions: 3,
          contenu: [
            {
              id: 'pompes',
              series: 1,
              repetitions: 8
            },
            {
              id: 'chaise_murale_isometrique',
              series: 1,
              temps_series: 45
            },
            {
              id: 'planche_haute_alternance_jambes',
              series: 1,
              temps_series: 60
            }
          ]
        },
        {
          id: 'pont_fessier_sol',
          series: 3,
          repetitions: 12
        },
        {
          id: 'gainage_dorsal_sol',
          series: 2,
          temps_series: 60
        }
      ],
      notes: 'Séance intense, prévoir une bouteille d\'eau.',
      tags: ['renforcement', 'complet', 'intensif'],
      est_publique: true
    },
    {
      id: 'seance-etirement-avance',
      nom: 'Étirements avancés',
      description: 'Séance d\'étirements approfondis pour améliorer la souplesse et la récupération.',
      niveau_id: 3, // difficile
      type_seance: 'étirement',
      categories: ['étirement', 'récupération_active'],
      objectifs: [
        'Augmenter la souplesse',
        'Améliorer la récupération',
        'Réduire les tensions musculaires'
      ],
      duree_estimee: 35,
      calories_estimees: 90,
      materiel_requis: ['tapis de yoga', 'coussin'],
      structure: [
        {
          id: 'respiration_allongee',
          series: 1,
          temps_series: 180
        },
        {
          id: 'etirement_actif_dos_sol',
          series: 2,
          temps_series: 90
        },
        {
          id: 'etirement_fessier_sol',
          series: 2,
          temps_series: 60
        },
        {
          id: 'etirement_pectoraux_mur',
          series: 2,
          temps_series: 60
        },
        {
          id: 'etirement_psoas_fente',
          series: 2,
          temps_series: 90
        },
        {
          id: 'ouverture_hanche_sol_respiration',
          series: 1,
          temps_series: 120
        }
      ],
      notes: 'Maintenir chaque position sans forcer, respirer profondément.',
      tags: ['étirement', 'souplesse', 'récupération'],
      est_publique: true
    },
    {
      id: 'seance-cardio-mixte',
      nom: 'Cardio mixte',
      description: 'Séance cardiovasculaire variée combinant différents types d\'exercices pour un entraînement complet.',
      niveau_id: 2, // intermédiaire
      type_seance: 'cardio',
      categories: ['cardio', 'renforcement'],
      objectifs: [
        'Améliorer l\'endurance cardiovasculaire',
        'Brûler des calories',
        'Renforcer le cœur'
      ],
      duree_estimee: 40,
      calories_estimees: 320,
      materiel_requis: ['tapis de yoga'],
      structure: [
        {
          id: 'echauffement_marche_active',
          series: 1,
          temps_series: 300
        },
        {
          type: 'bloc',
          repetitions: 4,
          contenu: [
            {
              id: 'genoux_hauts_talons_fesses',
              series: 1,
              temps_series: 60
            },
            {
              id: 'planche_haute_alternance_jambes',
              series: 1,
              temps_series: 45
            },
            {
              id: 'pompes',
              series: 1,
              repetitions: 6
            }
          ]
        },
        {
          id: 'gainage_respiratoire_allonge',
          series: 1,
          temps_series: 120
        }
      ],
      notes: 'Séance dynamique, adapter l\'intensité selon votre niveau.',
      tags: ['cardio', 'dynamique', 'endurance'],
      est_publique: true
    }
  ];

  try {
    for (const seance of testSeances) {
      const { data, error } = await supabase
        .from('seances')
        .upsert([seance], { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error(`❌ Erreur lors de l'insertion de "${seance.nom}":`, error);
      } else {
        console.log(`✅ Séance "${seance.nom}" insérée avec succès (ID: ${data.id})`);
      }
    }

    console.log('\n🎉 Insertion des séances de test terminée !');
    
    // Afficher le nombre total de séances
    const { count, error: countError } = await supabase
      .from('seances')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError);
    } else {
      console.log(`📊 Total des séances en base: ${count}`);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
insertTestSeances(); 