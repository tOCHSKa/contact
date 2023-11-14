<?php

header('Content-Type: application/json');

// Récupération des données de la requête
$data = json_decode(file_get_contents("php://input"));

// Vérification de la méthode de requête
$method = $_SERVER['REQUEST_METHOD'];

// Tableau pour stocker les contacts
$contacts = [];

// Traitement des différentes méthodes
if ($method === 'POST') {
    // Insertion d'un nouveau contact
    if (isset($data->nom) && isset($data->prenom) && isset($data->age)) {
        $nom = $data->nom;
        $prenom = $data->prenom;
        $age = $data->age;
        
        // Création d'un nouvel ID (vous pouvez utiliser Date.now() comme dans votre JavaScript)
        $id = $data->id;

        $newContact = [
            'id' => $id,
            'nom' => $nom,
            'prenom' => $prenom,
            'age' => $age
        ];

        array_push($contacts, $newContact);

        echo json_encode(['message' => 'Contact ajouté avec succès']);
    } else {
        echo json_encode(['error' => 'Veuillez fournir tous les champs nécessaires']);
    }
} elseif ($method === 'PUT') {
    // Mise à jour d'un contact
    if (isset($data->id) && isset($data->nom) && isset($data->prenom) && isset($data->age)) {
        $id = $data->id;
        $nom = $data->nom;
        $prenom = $data->prenom;
        $age = $data->age;

        // Recherche du contact dans le tableau
        $index = array_search($id, array_column($contacts, 'id'));

        if ($index !== false) {
            $contacts[$index]['nom'] = $nom;
            $contacts[$index]['prenom'] = $prenom;
            $contacts[$index]['age'] = $age;

            echo json_encode(['message' => 'Contact mis à jour avec succès']);
        } else {
            echo json_encode(['error' => 'Contact non trouvé']);
        }
    } else {
        echo json_encode(['error' => 'Veuillez fournir l\'ID et tous les champs nécessaires pour la mise à jour']);
    }
} elseif ($method === 'DELETE') {
    // Suppression d'un contact
    if (isset($data->id)) {
        $id = $data->id;

        // Recherche du contact dans le tableau
        $index = array_search($id, array_column($contacts, 'id'));

        if ($index !== false) {
            array_splice($contacts, $index, 1);
            echo json_encode(['message' => 'Contact supprimé avec succès']);
        } else {
            echo json_encode(['error' => 'Contact non trouvé']);
        }
    } else {
        echo json_encode(['error' => 'Veuillez fournir l\'ID pour la suppression']);
    }
} else {
    echo json_encode(['error' => 'Méthode non supportée']);
}
