let table = document.getElementById('table');
const nomInput = document.getElementById('nomInput');
const prenomInput = document.getElementById('prenomInput');
const ageInput = document.getElementById('ageInput');

class Contact {
    constructor(nom, prenom, age) {
        this.id = Date.now(); // Ajout de l'attribut id
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
    }

    modifierContact(nouveauNom, nouveauPrenom, nouvelAge) {
        this.nom = nouveauNom;
        this.prenom = nouveauPrenom;
        this.age = nouvelAge;
        //console.log('Contact modifié avec succès.');
    }

    afficherDetails() {
        //console.log(`ID: ${this.id}, Nom: ${this.nom}, Prénom: ${this.prenom}, Âge: ${this.age}`);
    }

    detruireContact() {
        // Suppression de la référence à l'instance du contact
        this.id = null;
        this.nom = null;
        this.prenom = null;
        this.age = null;
        //console.log('Contact détruit avec succès.');
    }
}

let btnElement = document.getElementById('btnElement');
btnElement.addEventListener('click', Ajouter);

function Ajouter() {
    // Récupération des valeurs des champs de saisie
    const nom = nomInput.value;
    const prenom = prenomInput.value;
    const age = ageInput.value;

    if (nom === '' || prenom === '' || age === '') {
        afficherAlerte('Veuillez remplir tous les champs.');
        return;
    }

    const contact = new Contact(nom, prenom, age);

    //console.log(contact);

    // Effectuer la requête avant d'attribuer les valeurs aux cellules
    ajouterContact('http://localhost/contact/back/back.php', contact)
        .then(() => {

            // Réinitialisation des champs de saisie
            nomInput.value = '';
            prenomInput.value = '';
            ageInput.value = '';
        })
        .catch(error => {
            console.error('Erreur lors de la requête:', error);
        });
}


function ajouterAuTableau(contact) {

    console.log('le contact ajouté :', contact);

    const trElement = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdNom = document.createElement('td');
    let tdPrenom = document.createElement('td');
    let tdAge = document.createElement('td');
    const tdBouton = document.createElement('td');
    const tdModifier = document.createElement('td');

    // Attribution des valeurs aux cellules
    tdId.textContent = contact.id;
    tdNom.textContent = contact.nom;
    tdPrenom.textContent = contact.prenom;
    tdAge.textContent = contact.age;


    //console.log(contact);


    const boutonSuppression = creerBouton('Supprimer', 'btn-warning', () => {
        // Appeler la méthode de destruction de la classe Contact
        supprimerContactCoteServeur(contact);
        contact.detruireContact();
        trElement.remove();

    });

    tdBouton.appendChild(boutonSuppression);

    const boutonModifier = creerBouton('Modifier', 'btn-primary', () => {
        const id = tdAge.value;
        const newNom = nomInput.value;
        const newPrenom = prenomInput.value;
        const newAge = ageInput.value;

        contact.modifierContact(id, newNom, newPrenom, newAge);
        //console.log(contact);

        mettreAJour('http://localhost/contact/back/back.php', contact)
            .then(response => {
                tdAge.value = contact.id;
                tdNom.textContent = contact.nom;
                tdPrenom.textContent = contact.prenom;
                tdAge.textContent = contact.age;
                nomInput.value = '';
                prenomInput.value = '';
                ageInput.value = '';
            })

            .catch(error => console.error('Erreur lors de la mise à jour:', error));
    });

    tdModifier.appendChild(boutonModifier);
    trElement.appendChild(tdId);
    trElement.appendChild(tdNom);
    trElement.appendChild(tdPrenom);
    trElement.appendChild(tdAge);
    trElement.appendChild(tdBouton);
    trElement.appendChild(tdModifier);

    // Ajout de la ligne au tableau
    table.appendChild(trElement);
}


window.addEventListener('load', () => recupererContacts());


async function recupererContacts() {
    try {
        const response = await fetch('http://localhost/contact/back/back.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }

        });
        const responseData = await response.json();
        console.log('responseData = ', responseData);

        const contactArray = Object.values(responseData.contacts);

        contactArray.map(element => {
            ajouterAuTableau(element);
        })

        return responseData;

    } catch (error) {

    }


}


async function ajouterContact(url, data) {

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json();
        console.log('responseData = ', responseData);

        ajouterAuTableau(responseData.newContact);
        return responseData.newContact;

    } catch (error) {
        console.error('Erreur:', error);
    }
}

function mettreAJour(url, data) {
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            id: data.id,  // Inclure l'identifiant dans les données
            nom: data.nom,
            prenom: data.prenom,
            age: data.age
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error('Erreur:', error);
            throw error;  // Propager l'erreur pour que la promesse soit rejetée
        });
}


function supprimerContactCoteServeur(contact) {
    // Effectuer la requête de suppression côté serveur
    fetch('http://localhost/contact/back/back.php', {
        method: 'DELETE',
        body: JSON.stringify({
            id: contact.id  // Inclure l'identifiant dans les données
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            // Supprimer la ligne du tableau du DOM après suppression côté serveur réussie
        })
        .catch(error => {
            console.error('Erreur lors de la suppression côté serveur:', error);
        });
}


function creerBouton(texte, classe, action) {
    const bouton = document.createElement('button');
    bouton.textContent = texte;
    bouton.classList.add('btn', classe);
    bouton.addEventListener('click', action);
    return bouton;
}

function afficherAlerte(message) {
    let alert = document.getElementById('error');
    alert.innerHTML = message;
    alert.classList.add('alert', 'alert-danger', 'text-center');

    // Ajouter une classe pour montrer l'alerte
    alert.style.display = 'block';

    // Supprimer la classe après 5 secondes
    setTimeout(() => {
        alert.style.display = 'none';
        alert.classList.remove('alert', 'alert-danger');
    }, 5000);

    console.error(message);
}




// function getContacts() {
//     return fetch('http://localhost/contact/back/back.php?action=getContacts')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Erreur HTTP! Statut: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             return data.contacts;  // Vous pouvez accéder à la liste des contacts ici
//         });
// }

// Exemple d'utilisation de la fonction
// getContacts()
//     .then(contacts => {
//         //console.log(contacts);
//         // Faites quelque chose avec la liste des contacts ici
//     })
//     .catch(error => console.error('Erreur lors de la requête:', error));
