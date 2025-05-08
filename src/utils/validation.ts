
import { z } from "zod";
import DOMPurify from "dompurify";

// Common validation schemas
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes");

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(255, "Email must be less than 255 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const bioSchema = z
  .string()
  .max(500, "Bio must be less than 500 characters")
  .transform((val) => DOMPurify.sanitize(val));

export const commentSchema = z
  .string()
  .min(1, "Comment cannot be empty")
  .max(1000, "Comment must be less than 1000 characters")
  .transform((val) => DOMPurify.sanitize(val));

// Card form validation schema
export const cardFormSchema = z.object({
  name: z.string().min(1, "Card name is required").max(100),
  type: z.string().min(1, "Card type is required"),
  cost: z.number().min(0, "Cost cannot be negative"),
  rarity: z.string().min(1, "Rarity is required"),
  imageUrl: z.string().url("Invalid image URL"),
  colors: z.array(z.string()).optional(),
  flavorText: z.string().max(500).optional(),
  artist: z.string().max(100).optional(),
  legality: z.string().max(100).optional(),
  price: z.number().min(0).optional(),
});

// Profile validation schema
export const profileSchema = z.object({
  username: usernameSchema,
  display_name: z.string().min(1, "Display name is required").max(50),
  bio: bioSchema.optional(),
});

// Sanitize user input
export const sanitizeUserInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
};

// Create a utility function to parse HTML safely for rendering
export const parseHtml = (html: string): string => {
  if (!html) return '';
  
  // First sanitize the HTML to prevent XSS attacks
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'class']
  });
  
  return sanitized;
};
