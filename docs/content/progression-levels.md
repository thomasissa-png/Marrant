# Système de progression — deviens-marrant.fr

## Niveaux utilisateur

| Niveau | Nom | XP requis | Icône | Description |
|--------|-----|-----------|-------|-------------|
| 1 | Novice | 0 | 🌱 | Tu débutes dans l'humour. Tout est à apprendre ! |
| 2 | Apprenti | 100 | 📚 | Tu commences à comprendre les bases. Les premières blagues fusent. |
| 3 | Farceur | 500 | 🃏 | Tu fais rire régulièrement. Ton timing s'améliore. |
| 4 | Comique | 1500 | 🎭 | Tu maîtrises plusieurs techniques. Les gens te trouvent drôle. |
| 5 | Légende | 5000 | 👑 | Tu es une machine à rire. Ta répartie est légendaire. |

## Gains d'XP

| Action | XP gagnés | Fréquence max |
|--------|-----------|---------------|
| Lire une blague | +2 XP | 10/jour (free) · illimité (premium) |
| Révéler la chute | +1 XP | par blague |
| Lire un conseil complet | +10 XP | 5/jour (free) · illimité (premium) |
| Compléter un exercice | +25 XP | par exercice |
| Regarder une vidéo (>50%) | +5 XP | par vidéo |
| Connexion quotidienne | +5 XP | 1/jour |
| Streak bonus (7 jours) | +50 XP | 1/semaine |
| Streak bonus (30 jours) | +200 XP | 1/mois |
| Sauvegarder un favori | +1 XP | par favori |
| Partager du contenu | +3 XP | par partage |
| Utiliser l'IA (premium) | +5 XP | par interaction |

## Streak

Le streak compte les jours de connexion consécutifs.

- **Jours 1-6** : pas de bonus spécial, juste +5 XP/jour
- **Jour 7** : bonus hebdo +50 XP + badge "Semaine de feu 🔥"
- **Jour 30** : bonus mensuel +200 XP + badge "Mois légendaire 👑"
- **Jour 100** : badge "Centurion de l'humour 🏛️" + +500 XP
- **Jour 365** : badge "Maître absolu 🌟" + +2000 XP

Si le streak est cassé (un jour manqué), il repart à 0.

## Badges (Achievements)

### Badges de progression
| Badge | Condition | Icône |
|-------|-----------|-------|
| Premier pas | Lire sa première blague | 👣 |
| Apprenti lecteur | Lire 50 blagues | 📖 |
| Dévoreur de blagues | Lire 500 blagues | 📚 |
| Premier conseil | Lire son premier conseil | 💡 |
| Étudiant assidu | Compléter 10 exercices | ✏️ |
| Coach en herbe | Compléter 50 exercices | 🎓 |

### Badges de streak
| Badge | Condition | Icône |
|-------|-----------|-------|
| Semaine de feu | Streak de 7 jours | 🔥 |
| Mois légendaire | Streak de 30 jours | 👑 |
| Centurion | Streak de 100 jours | 🏛️ |
| Maître absolu | Streak de 365 jours | 🌟 |

### Badges de catégorie
| Badge | Condition | Icône |
|-------|-----------|-------|
| Maître du timing | Lire tous les conseils Timing | ⏱️ |
| Roi de l'auto-dérision | Lire tous les conseils Auto-dérision | 🪞 |
| Observateur né | Lire tous les conseils Observation | 🔍 |
| Langue acérée | Lire tous les conseils Répartie | ⚔️ |
| Conteur | Lire tous les conseils Storytelling | 📝 |
| Maître de l'absurde | Lire tous les conseils Absurde | 🤪 |
| Jongleur de mots | Lire tous les conseils Jeux de mots | 🎯 |

### Badges spéciaux
| Badge | Condition | Icône |
|-------|-----------|-------|
| Premium | Être abonné premium | ⭐ |
| Collectionneur | Avoir 50 favoris | 💎 |
| Vidéophile | Regarder 30 vidéos | 🎬 |
| IA Whisperer | Utiliser l'IA 20 fois | 🤖 |
| Partageur | Partager 10 contenus | 📤 |

## Calcul du niveau

```typescript
function getUserLevel(xp: number): UserLevel {
  if (xp >= 5000) return "LEGENDE";
  if (xp >= 1500) return "COMIQUE";
  if (xp >= 500) return "FARCEUR";
  if (xp >= 100) return "APPRENTI";
  return "NOVICE";
}

function getXpToNextLevel(xp: number): { current: number; required: number } {
  const thresholds = [100, 500, 1500, 5000];
  const nextThreshold = thresholds.find(t => t > xp) ?? 5000;
  const prevThreshold = thresholds.filter(t => t <= xp).pop() ?? 0;
  return {
    current: xp - prevThreshold,
    required: nextThreshold - prevThreshold,
  };
}
```

## Progression par catégorie

Chaque catégorie de conseils a sa propre barre de progression :

- **0-33%** : Débutant dans cette catégorie
- **34-66%** : Intermédiaire
- **67-100%** : Expert

La progression est calculée par : `(conseils lus dans la catégorie / total conseils dans la catégorie) × 100`

Quand une catégorie atteint 100%, le badge de catégorie correspondant est débloqué.
