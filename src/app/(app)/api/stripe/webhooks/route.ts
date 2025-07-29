import type { Stripe } from "stripe"
import { NextResponse } from "next/server"
import config from "@/payload.config"
import { getPayload } from "payload"

import { stripe } from "@/lib/stripe"
import { ExpandedLineItem } from "@/types"

export async function POST(request: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (error) {
    // instanceof là một phép so sánh để kiểm tra xem một đối tượng có phải là một instance của một class cụ thể hay không (ở đây là để kiểm tra xem error có phải là một instance của Error hay không)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (error! instanceof Error) {
      console.error(errorMessage)
    }
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
  ]

  const payload = await getPayload({ config })

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session

          if (!data.metadata?.userId) {
            throw new Error('User ID is required')
          }

          const user = await payload.findByID({
            collection: 'users',
            id: data.metadata.userId,
          })
          
          if (!user) {
            throw new Error('User not found')
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(data.id, {
            expand: ['line_items.data.price.product']
          })

          if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
            throw new Error('No line items found')
          }

          const lineItems = expandedSession.line_items.data as ExpandedLineItem[]

          for (const lineItem of lineItems) {
            await payload.create({
              collection: 'orders',
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                products: lineItem.price.product.metadata.id,
                name: lineItem.price.product.metadata.name,
              }
            })
          }
          break
        default:
          throw new Error(`Unhandled event type ${event.type}`) 
      }
    } catch (error) {
      console.error(error)
      return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 })
}
