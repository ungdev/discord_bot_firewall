# Bot discord

## But
Lors du Coronavirus 2019, création d'un Bot discord rassemblant les 3 000 étudiants de mon [université / école d'ingé publique](https://utt.fr).
Nécessité de gérer les rôles des membres sur le discord, via une connexion extérieur. Ce bot dispose d'une interface web où les étudiants et profs se connectent via OAuth2 et se voient affecter les droits de lecture et d'écriture correspondant.

Egalement, gestion (création/suppression) des rôles et channels correspondant aux cours des étudiants, ainsi que création d'amphi à la volée.

Ce bot permet également d'exporter en hors ligne tout le contenu d'un channel en html, via [https://github.com/Tyrrrz/DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) qui génère le html et wget/zip génèrent la version offline (600 messages max).


## Fonctionnalités

* Connexion par le [site Etu](https://etu.utt.fr) via OAuth2 puis on indique son id discord (utilisateur#discriminant)
* Attribue le rôle enseignant / étudiant
* Renomme les gens Prénom NOM (+ " - Branche NIVEAU" pour les étudiants)
* Pour les étudiants : attribution des UEs + rôle selon la branche
* Création des rôles inexistants, signalement de la création sur un channel (si le rôle n'existe pas, il est créé et l'utilisateur recommence la manip)
* Envoie un message automatique aux nouveaux qui rejoignent le serveur en leur disant d'aller sur le site
* Sur le site, une petite notice qui explique aux gens comment installer le logiciel
* Génération dynamique de channels vocaux et texte. L'utilisateur se place sur un channel vocal précis, et il est transporté dans un channel vocal créé (utile pour créer des salles de cours à la volée). Les channels texte seront supprimés quand la denrière personne aura quitté le vocal.
* Commandes :
    * ``PREFIX addUE @role <categoryID>`` qui crée un chan texte et vocal avec les permissions qui vont bien et dans la catégorie indiquée, la commande ne peut être exécutée que depuis un channel précis
    * ``PREFIX delUE #channelTexteUE`` qui supprime les deux channels d'une UE, ainsi que son rôle, la commande ne peut être exécutée que depuis un channel précis.
    * ``PREFIX getNb @ROLE`` qui affiche le nombre de personnes dans le role correspondant.
    * ``PREFIX getRoles NombrePersonne`` qui affiche la liste des rôle ne contenant que le nombre de personnes demandé
    * ``PREFIX getZeroOne`` qui affiche la liste des rôle ne contenant que 0 ou 1 personne.
    * ``PREFIX getUrl`` Affiche les url du serveur web du bot, le lien d'invitation discord
    * ``PREFIX export``. Exporte tout le channel dans laquelle la commande est tapée, dans un html lisible offline. Tout ceux ayant un rôle >= Enseignant peuvent taper cette commande n'importe où.
    
## Installation

* Via [docker](https://hub.docker.com/repository/docker/larueli/discord_bot_firewall)
* Manuellement
    * ``git clone https://github.com/larueli/discord_bot_firewall``
    * ``cd discord_bot_firewall``
    * ``cp .env.dist .env`` et éditez-le
    * ``npm install``
    * ``node bin/www``

# Auteur

Je suis [Ivann LARUELLE](https://www.linkedin.com/in/ilaruelle/), étudiant-ingénieur en Réseaux et Télécommunications à l'[Université de Technologie de Troyes](https://www.utt.fr/), école publique d'ingénieurs.

N'hésitez pas à me contacter pour me signaler tout bug ou remarque. Je suis joignable à [ivann.laruelle@gmail.com](mailto:ivann.laruelle@gmail.com).