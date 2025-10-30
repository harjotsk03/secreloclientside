const secretTypeOptions = [
  { label: "API Key", value: "api_key" },
  { label: "OAuth Token", value: "oauth_token" },
  { label: "Client Secret", value: "client_secret" },
  { label: "Database Connection String", value: "db_connection" },
  { label: "SSH Private Key", value: "ssh_key" },
  { label: "Webhook Secret", value: "webhook_secret" },
  { label: "Cloud Storage Keypair", value: "cloud_keypair" },
  { label: "JWT Signing Key", value: "jwt_key" },
  { label: "Custom Secret", value: "custom_secret" },
];

export function formatSecretType(typeValue) {
  const option = secretTypeOptions.find((opt) => opt.value === typeValue);
  return option ? option.label : typeValue; // fallback to raw value
}
