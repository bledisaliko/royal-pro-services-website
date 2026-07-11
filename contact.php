<?php
function clean_field($value) {
  $value = is_string($value) ? $value : '';
  $value = trim($value);
  $value = strip_tags($value);
  return preg_replace('/[\r\n]+/', ' ', $value);
}

function show_error_page($message) {
  http_response_code(500);
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contact Error | Royal Pro Services</title><link rel="stylesheet" href="assets/css/style.css"></head><body><main class="section soft"><div class="container"><div class="thank-you-card"><p class="eyebrow">Message not sent</p><h1>Sorry, your request could not be sent.</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p><div class="hero-actions" style="justify-content:center;"><a class="btn btn-primary" href="tel:+16479191332">Call +1 647-919-1332</a><a class="btn btn-dark" href="contact.html">Back to Contact</a></div></div></div></main></body></html>';
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: contact.html');
  exit;
}

if (!empty($_POST['website'])) {
  header('Location: thank-you.html');
  exit;
}

$fields = [
  'name' => clean_field($_POST['name'] ?? ''),
  'phone' => clean_field($_POST['phone'] ?? ''),
  'email' => clean_field($_POST['email'] ?? ''),
  'location' => clean_field($_POST['location'] ?? ''),
  'service' => clean_field($_POST['service'] ?? ''),
  'urgency' => clean_field($_POST['urgency'] ?? ''),
  'message' => clean_field($_POST['message'] ?? ''),
  'client_type' => clean_field($_POST['client_type'] ?? '')
];

$required = ['name', 'phone', 'location', 'service', 'urgency', 'message'];
foreach ($required as $key) {
  if ($fields[$key] === '') {
    show_error_page('Please go back and complete all required fields, or call +1 647-919-1332 for immediate help.');
  }
}

if ($fields['email'] !== '' && !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
  show_error_page('Please go back and enter a valid email address, or call +1 647-919-1332 for immediate help.');
}

$to = 'info@royalproservices.ca';
$subject = 'New Royal Pro Services website request';
$body = "New restoration request from the Royal Pro Services website\n\n";
$body .= "Name: {$fields['name']}\n";
$body .= "Phone: {$fields['phone']}\n";
$body .= "Email: {$fields['email']}\n";
$body .= "I am a: {$fields['client_type']}\n";
$body .= "Location: {$fields['location']}\n";
$body .= "Service needed: {$fields['service']}\n";
$body .= "Urgency: {$fields['urgency']}\n";
$body .= "Message: {$fields['message']}\n";

$host = $_SERVER['SERVER_NAME'] ?? 'royalproservices.ca';
$headers = "From: Royal Pro Services Website <no-reply@" . $host . ">\r\n";
if ($fields['email'] !== '') {
  $headers .= "Reply-To: {$fields['email']}\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (@mail($to, $subject, $body, $headers)) {
  header('Location: thank-you.html');
  exit;
}

show_error_page('Please call +1 647-919-1332 directly or email info@royalproservices.ca.');
?>
