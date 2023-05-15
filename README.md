# Contexte

### _D'où viennent les données, qui les a créées et dans quel contexte ?_

---

Nous n'avons pas envie de reprendre un dataset générique, car nous trouvons cela moins pertinent, nous pensons qu'un projet personnel serait plus intéressant à explorer pour nous autant que pour vous. 😃

Nous avons donc 3 jeux de données. Le premier provient de la machine _CPAP_ (_Continuous Positive Airway Pressure_) de Patrick. Le deuxième jeu de données provient de la _Xiaomi Mi Smart Band 6_ de Miguel, le dernier jeu de données provient de l'_Apple Watch Serie 8_ de Patrick, la difficulté pour l'_Apple Watch_ étant que le suivi du sommeil et des phases peut se faire uniquement si le "programme sommeil" est enclenché pour la nuit en question.

Nous souhaitons mettre ces deux jeux de données en comparaison pour analyser les potentielles différences entre le sommeil de deux personnes, dont une est atteinte du syndrome d'apnées obstructives du sommeil (_SAOS_).

# Description

### _Comment les données sont structurées ? Format, attributs et type de données_

---

Les deux datasets provenant de la _Xiaomi Mi Smart Band 6_ et du _CPAP_ sont exportés en _CSV_ (_Comma-Separated Values_), ce qui nous permet de les traiter facilement.

Pour les données provenant de l'Apple Watch, elles seront exportées par l'application _Santé_ de l'iPhone au format _XML_ qui pourront aussi être traités facilement.

Les différents attributs vont surtout concerner les choses suivantes : heure de sommeil, heure de réveil, moyenne d'apnées par heure, fuites d'air et les durées des phases de sommeil.

En ce qui concerne les "variables" nous aurons principalement trois formats qui seront des _string_, des _int_ et des _dates_.

# But

### _Qu'est-ce que nous voulons découvrir ? Des tendances ? Vous voulez explorer ou expliquer ?_

---

Nous voulons découvrir si pendant certaines périodes de l'année, un plus grand nombre d'apnées est visible ou non et si cela impacte le sommeil de l'utilisateur. Cela pourrait, par exemple, le faire sortir de sa phase de sommeil profond et impacter son énergie le lendemain.

Pour le moment, nous avons une vision explicative, parce qu'il serait compliqué de faire de l'exploration avec des données de sommeil et donc l'expérience ne sera pas très intéressante pour l'utilisateur.

# Références

### _Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?_

---

Si nous parlons strictement des données relatives au sommeil d'une personne, les secteurs médicaux et les centres du sommeil sont les organismes qui les traîtent le plus fréquemment. Ces derniers cherchent à analyser le sommeil en général ou la fréquence d'apparition d'apnées par exemple.

Si nous parlons de **nos** données, personne d'autre dans le web n'aura utilisé **ces** données précisément, à l'exception des données _CPAP_ de Patrick en raison de son suivi par un pneumologue et par la ligue Pulmonaire Vaudoise, ce qui rends le projet plus unique.

# Rendu final
## Méthode de préparation de données

### Données Xiaomi Mi Band de Miguel

Concernant ces données, le traitement a été purement logiciel.
Nous avons simplement trié ces données pour correspondre à la plage qu'est le mois de mars 2023.

### Données Cpap de Patrick

Concernant ces données, le traitement a été purement logiciel.
Nous avons simplement trié ces données pour correspondre à la plage qu'est le mois de mars 2023.

### Données Apple Watch de Patrick

Pour les données de l'Apple Watch c'est un autre tour de bras! Le fichier est non seulement un XML mais il était aussi beaucoup trop lourd (1.66 Go) et faisait crash le navigateur lorsque l'on voulais le trier en JS. Nous avons donc dû faire un tri préliminaire pour ne garder que les données de sommeil datant de 2023 afin de l'alléger. Une fois cette opération faite, le fichier était assez léger pour pouvoir être trié en JS et a subi le même sort que les autres datasets soit il a été trié pour ne garder que les données de Mars 2023.

Le site est déployé sur l'adresse : sleepcompare.netlify.app
