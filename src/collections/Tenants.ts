import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Store Name',
      // admin là để hiển thị trên admin panel
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
      // readOnly là để không thể sửa trên admin panel
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'You cannot create products until you have submitted your Stripe details',
      },
    }
  ],
}
