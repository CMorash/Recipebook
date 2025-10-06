/**
 * Secrets Management Configuration
 * 
 * This module handles loading secrets from environment variables or AWS Secrets Manager.
 * For MVP: Uses environment variables
 * For Production: Can be configured to use AWS Secrets Manager for automatic rotation
 */

// Future: Uncomment these imports when integrating AWS Secrets Manager
// import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

interface Secrets {
  jwtSecret: string
  mongodbUri: string
}

let cachedSecrets: Secrets | null = null

/**
 * Load secrets from environment variables (current MVP approach)
 */
function loadSecretsFromEnv(): Secrets {
  const jwtSecret = process.env.JWT_SECRET
  const mongodbUri = process.env.MONGODB_URI

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  return {
    jwtSecret,
    mongodbUri,
  }
}

/**
 * Load secrets from AWS Secrets Manager (future enhancement)
 * 
 * To enable:
 * 1. Install: npm install @aws-sdk/client-secrets-manager
 * 2. Set environment variables: AWS_REGION, AWS_SECRET_NAME
 * 3. Configure IAM role with secretsmanager:GetSecretValue permission
 * 4. Uncomment the code below and update getSecrets() to use it
 */
/*
async function loadSecretsFromAWS(): Promise<Secrets> {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1',
  })

  const secretName = process.env.AWS_SECRET_NAME || 'digital-cookbook/secrets'

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    )

    if (!response.SecretString) {
      throw new Error('Secret value is empty')
    }

    const secrets = JSON.parse(response.SecretString)

    return {
      jwtSecret: secrets.JWT_SECRET,
      mongodbUri: secrets.MONGODB_URI,
    }
  } catch (error) {
    console.error('Error loading secrets from AWS:', error)
    throw error
  }
}
*/

/**
 * Get secrets (with caching to avoid repeated AWS calls)
 */
export async function getSecrets(): Promise<Secrets> {
  if (cachedSecrets) {
    return cachedSecrets
  }

  // Current MVP approach: Load from environment variables
  cachedSecrets = loadSecretsFromEnv()

  // Future enhancement: Uncomment to use AWS Secrets Manager
  // if (process.env.USE_AWS_SECRETS === 'true') {
  //   cachedSecrets = await loadSecretsFromAWS()
  // } else {
  //   cachedSecrets = loadSecretsFromEnv()
  // }

  return cachedSecrets
}

/**
 * Refresh secrets (useful when secrets are rotated)
 */
export function refreshSecrets(): void {
  cachedSecrets = null
}

/**
 * Get JWT secret (convenience method)
 */
export async function getJWTSecret(): Promise<string> {
  const secrets = await getSecrets()
  return secrets.jwtSecret
}

/**
 * Get MongoDB URI (convenience method)
 */
export async function getMongoDBUri(): Promise<string> {
  const secrets = await getSecrets()
  return secrets.mongodbUri
}

