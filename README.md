# Bot discord

#Fonctionnalités

* Connexion par le [site Etu](https://etu.utt.fr) puis on indique son id discord (utilisateur#discriminant)
* Attribue le rôle enseignant / étudiant
* Renomme les gens Prénom NOM (+ " - Branche NIVEAU" pour les étudiants)
* Pour les étudiants : attribution des UEs + rôle selon la branche
* Création des rôles inexistants (si le rôle n'existe pas, il est créé et l'utilisateur recommence la manip)
* Commande ``/addUE @role <categoryID>`` qui crée un chan texte et vocal avec les permissions qui vont bien et dans la catégorie indiquée, la commande ne peut être exécutée que depuis #bot-commands (modération)
* Envoie un message automatique aux nouveaux qui rejoignent le serveur en leur disant d'aller sur le site
* Sur le site, une petite notice qui explique aux gens comment installer le logiciel