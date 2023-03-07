# Contexte
### *D'où viennent les données, qui les a créées et dans quel contexte ?*
---
Nous n'avons pas envie de reprendre un dataset générique, car nous trouvons cela moins pertinent, nous pensons qu'un projet personnel serait plus intéressant à explorer pour nous autant que pour vous. 😃

Nous avons donc 3 jeux de données. Le premier provient de la machine *CPAP* (*Continuous Positive Airway Pressure*) de Patrick. Le deuxième jeu de données provient de la *Xiaomi Mi Smart Band 6* de Miguel, le dernier jeu de données provient de l'*Apple Watch Serie 8* de Patrick, la difficulté pour l'*Apple Watch* étant que le suivi du sommeil et des phases peut se faire uniquement si le "programme sommeil" est enclenché pour la nuit en question.

Nous souhaitons mettre ces deux jeux de données en comparaison pour analyser les potentielles différences entre le sommeil de deux personnes, dont une est atteinte du syndrome d'apnées obstructives du sommeil (*SAOS*).

# Description 
### *Comment les données sont structurées ? Format, attributs et type de données*
---
Les deux datasets provenant de la *Xiaomi Mi Smart Band 6* et du *CPAP* sont exportés en *CSV* (*Comma-Separated Values*), ce qui nous permet de les traiter facilement.

Pour les données provenant de l'Apple Watch, elles seront exportées par l'application *Santé* de l'iPhone au format *XML* qui pourront aussi être traités facilement.

Les différents attributs vont surtout concerner les choses suivantes : heure de sommeil, heure de réveil, moyenne d'apnées par heure, fuites d'air et les durées des phases de sommeil.

En ce qui concerne les "variables" nous aurons principalement trois formats qui seront des *string*, des *int* et des *dates*.

# But
### *Qu'est-ce que nous voulons découvrir ? Des tendances ? Vous voulez explorer ou expliquer ?*
---
Nous voulons découvrir si pendant certaines périodes de l'année, un plus grand nombre d'apnées est visible ou non et si cela impacte le sommeil de l'utilisateur. Cela pourrait, par exemple, le faire sortir de sa phase de sommeil profond et impacter son énergie le lendemain.

Pour le moment, nous avons une vision explicative, parce qu'il serait compliqué de faire de l'exploration avec des données de sommeil et donc l'expérience ne sera pas très intéressante pour l'utilisateur.

# Références
### *Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?*
---
Si nous parlons strictement des données relatives au sommeil d'une personne, les secteurs médicaux et les centres du sommeil sont les organismes qui les traîtent le plus fréquemment. Ces derniers cherchent à analyser le sommeil en général ou la fréquence d'apparition d'apnées par exemple.

Si nous parlons de **nos** données, personne d'autre dans le web n'aura utilisé **ces** données précisément, à l'exception des données *CPAP* de Patrick en raison de son suivi par un pneumologue et par la ligue Pulmonaire Vaudoise, ce qui rends le projet plus unique.