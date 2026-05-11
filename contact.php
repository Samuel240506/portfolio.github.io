<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// Honeypot anti-spam : si le champ caché est rempli, c'est un bot
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Adresse email invalide.']);
    exit;
}

$to       = 'aubronsamuel06@gmail.com';
$mailSubj = '=?UTF-8?B?' . base64_encode('[Portfolio] ' . ($subject ?: 'Nouveau message de contact')) . '?=';

$body  = "Nouveau message reçu depuis le formulaire de contact du portfolio.\n\n";
$body .= "────────────────────────────────\n";
$body .= "Nom / Entreprise : $name\n";
$body .= "Email            : $email\n";
$body .= "Objet            : " . ($subject ?: '(non précisé)') . "\n";
$body .= "────────────────────────────────\n\n";
$body .= "Message :\n\n$message\n";

$headers  = "From: Portfolio Contact <noreply@samuel-aubron.fr>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

if (mail($to, $mailSubj, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'envoi. Réessayez ou contactez-moi directement par email.']);
}
