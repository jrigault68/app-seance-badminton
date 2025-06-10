import { pickRandom } from "@/utils/helpers";

function estimerTempsParole(message, motsParSeconde = 2.7) {
  const nbMots = message.trim().split(/\s+/).length;
  const secondes = nbMots / motsParSeconde;
  return secondes * 1000; // ms
}

export function speakMessage(message, rate = 1.2) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(message);
	utterance.rate = rate
    utterance.lang = "fr-FR";
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // même si erreur, on continue
    speechSynthesis.speak(utterance);
  });
}

export async function speak(messages, current = {}, tempsRestantMs, margeMs = 500, skippedMessagesRef) {
	const nonPrononces = [];
	console.log("Messages d'entrée :", messages);
  // 🛠️ Étape 1 — convertir en tableau standard de messages
  const messagesExpandes = []
    .concat(messages) // au cas où messagesInput est un string ou un seul objet
    .flatMap(msg => {
      const resultat = getMessagesFromKey(msg, current, skippedMessagesRef);
      if (Array.isArray(resultat)) return resultat;
      if (typeof resultat === "string" || typeof resultat === "object") return [resultat];
      return [];
    });

  // 🧹 Étape 2 — vérifier qu'on a bien des messages valides
  if (!messagesExpandes.length) {
    console.log("⛔ Aucun message à lire après expansion");
    return;
  }
  const start = performance.now();
  for (const msg of messagesExpandes) {
    const texte = typeof msg === "string" ? msg : msg?.texte || "";
    if (!texte) continue;
console.log("Messages :", messages);
    const elapsed = performance.now() - start;
    const reste = tempsRestantMs - elapsed;

    const dureeEstimee = estimerTempsParole(texte);

    if (reste < dureeEstimee + margeMs) {
		nonPrononces.push(texte);
      console.log(`[STOP] Plus assez de temps pour "${texte}" (${dureeEstimee.toFixed(0)}ms estimés, ${reste.toFixed(0)}ms restants)`);
      break;
    }

    console.log(`[SPEAK] "${texte}" (${dureeEstimee.toFixed(0)}ms estimés, ${reste.toFixed(0)}ms restants)`);
    await speakMessage(texte);
  }
  return nonPrononces;
}

import messagesJSON from "@/assets/messages_vocaux.json";

function getMessagesFromKey(key, current = {}, skippedMessagesRef) {
  if (!key || typeof key !== "string") return [];
  
  if (key === "message_retarde" && skippedMessagesRef?.current?.length) {
    const allMsg = skippedMessagesRef.current.join(" ");
    console.log("🔍 Résultat getMessagesFromKey :", key, "→", allMsg);
    return [allMsg]; // retourne sous forme de tableau
  }else if (key === "message_retarde"){return "";}
  
  // Cas brut sans clé structuré
  if (!key.includes(".")) {
    return [key]; // texte brut
  }
  
  const [cat, sub] = key.split(".");
  const raw = messagesJSON[cat]?.[sub];
console.log("🔍 Résultat getMessagesFromKey :", key, "→", raw);
  if (!raw) return [key]; // fallback si pas trouvé

  // 🎯 Cas 1 : tableau de variantes
  if (Array.isArray(raw)) {
    const texte = raw[Math.floor(Math.random() * raw.length)];
    return [remplacerVariables(texte, current)];
  }

  // 🎯 Cas 2 : string simple à template
  return [remplacerVariables(raw, current)];
}

// ✨ Fonction helper pour insérer les variables dynamiques
function remplacerVariables(template, current) {
  return template
    .replace(/{duration}/g, formatDureeVocal(current?.duree || current?.duration || 0))
    .replace(/{numero}/g, current?.numero || "")
    .replace(/{total}/g, current?.total || "")
    .replace(/{exo\.nom}/g, current?.exo?.nom || "")
    .replace(/{exo\.description}/g, current?.exo?.description || "")
    .replace(/{exo\.position_depart}/g, current?.exo?.position_depart || "")
	.replace(/{exo\.erreurs}/g, Array.isArray(current?.exo?.erreurs) && current?.exo?.erreurs.length > 0 ? pickRandom(current?.exo?.erreurs) : "")
    .replace(/{exo\.details}/g, (() => {
		  const exo = current?.exo || {};
		  // Séries + répétitions (classique)
		  if (exo.series && exo.series > 1 && exo.repetitions) {
			return `${exo.series} séries de ${exo.repetitions} répétitions`;
		  }
		  // Séries + temps par série
		  if (exo.series && exo.series > 1 && exo.temps_series) {
			return `${exo.series} séries de ${formatDureeVocal(exo.temps_series)}`;
		  }
		   // Juste répétitions
		  if (exo.repetitions) {
			return `${exo.repetitions} répétitions`;
		  }
		  // Pas de séries, mais durée fixe
		  if ((!exo.series || exo.series <=1) && exo.temps_series) {
			return `pendant ${formatDureeVocal(exo.temps_series)}`;
		  }
		  // Juste durée
		  if (exo.duree || exo.duration) {
			return `pendant ${formatDureeVocal(exo.duree || exo.duration)}`;
		  }
		  // Fallback
		  return "Exercice libre";
		})());
}

export function formatDureeVocal(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const parts = [];
  if (h) parts.push(`${h} ${h > 1 ? "heures" : "heure"}`);
  if (m) parts.push(`${m} ${m > 1 ? "minutes" : "minute"}`);
  if (s) parts.push(`${s} ${s > 1 ? "secondes" : "seconde"}`);

  return parts.join(" et ");
}
