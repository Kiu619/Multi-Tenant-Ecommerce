import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/lib/access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Store Name',
      admin: {
        description: 'The name of the store',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
      admin: {
        description: 'The subdomain name of the store',
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: 'Stripe Account ID associated with your shop',
      },
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: 'You cannot create products until you have submitted your Stripe details',
      },
    }
  ],
}
