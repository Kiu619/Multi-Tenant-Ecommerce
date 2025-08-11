import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/lib/access'
import { Tenant } from '@/payload-types'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) {
        return true
      }

      const tenant = req.user?.tenants?.[0]?.tenant as Tenant

      return Boolean(tenant?.stripeDetailsSubmitted)
    }
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in VND'
      }
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'refundPolicy',
      type: 'select',
      required: true,
      options: [
        { label: '14 days', value: '14-days' },
        { label: '30 days', value: '30-days' },
        { label: '60 days', value: '60-days' },
        { label: '90 days', value: '90-days' },
        { label: '180 days', value: '180-days' },
        { label: '365 days', value: '365-days' },
        { label: 'No refund', value: 'no-refund' }
      ],
      defaultValue: '14-days'
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting.'
      }
    }
  ],
}
