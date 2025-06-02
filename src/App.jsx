import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const exercices = [
  {
    name: "Automassage Quadriceps",
    duration: 30,
    description:
      "Allongé sur le ventre, rouleau sous les cuisses. Faire des va-et-vient lents du haut vers le bas des quadriceps.",
    position: "Face contre sol, appui sur les avant-bras",
    erreurs: "Ne pas rouler trop vite ni passer directement sur les articulations.",
  },
  {
    name: "Étirement bras croisé",
    duration: 30,
    description:
      "Attraper le bras droit avec la main gauche et le tirer doucement vers la gauche à hauteur d’épaule.",
    position: "Debout ou assis, dos droit",
    erreurs: "Ne pas tourner le buste, garder les épaules basses.",
  },
];

// ... le reste du fichier (logique du composant React déjà fourni précédemment)

export default function App() {
  // Complet code JSX du composant ici (déjà connu dans la conversation)
}