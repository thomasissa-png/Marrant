/**
 * s26 batterie (défaut n°1) : longueur maximale d'une adresse e-mail reçue par le site, 254 caractères (RFC 5321,
 * chemin de 256 octets moins les chevrons). Même borne à l'inscription, à la connexion, au mot de passe oublié, à la
 * réinitialisation et à la recopie d'une question par l'équipe (la lettre et la renonciation l'avaient déjà).
 * Aucune adresse plus longue ne peut exister en base : au-delà, la requête est refusée avant toute lecture.
 */
export const EMAIL_LONGUEUR_MAX = 254;
