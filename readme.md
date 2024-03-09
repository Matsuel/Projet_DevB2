# Back end

*Utilisation de TypeScript plutôt que Ruby car les websockets TS sont plus facile à utiliser, nous utiliserons Ruby si nous faisons une API*

## 4 types de Tables en db mongo

### Users cherchant auto école

#### Email
#### Password
#### Accepter les notifs bool oui/non

### Auto école

#### Nom
#### Email
#### Password
#### Adresse
#### Photos string[] images converties en base64
#### Noms des profs string[]
#### Type de formations disponibles string[]
#### Date abonnement voir comment gérer ça
#### Mail des anciens élèves inscrit string[]
#### Liste des élèves demandant à être approuvés string []

### Personne ayant appris dans l'ae

#### Mail devant être dans la liste de l'auto école sinon demande d'être approuvé
#### Password
#### Demande de notifs

### Table Conversations

#### users_id string[]

### messages+conversationId

#### sender_id
#### date
#### content
