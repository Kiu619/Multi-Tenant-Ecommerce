'use client'

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { ReviewsGetOneOutput } from "@/modules/reviews/types"
import { StarPicker } from "@/components/star-picker"
import { toast } from "sonner"

interface Props {
  productId: string
  review?: ReviewsGetOneOutput
}

const formSchema = z.object({
  description: z.string().min(1, 'Description must be at least 1 character'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
})

export const ReviewForm = ({ productId, review }: Props) => {
  const [isPreview, setIsPreview] = useState(!!review)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: review?.description || '',
      rating: review?.rating || 0,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (review) {
      updateReview.mutate({
        reviewId: review.id,
        description: values.description,
        rating: values.rating,
      })
    } else {
      createReview.mutate({
        ...values,
        productId,
      })
    }
  }

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createReview = useMutation(trpc.reviews.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
        productId,
      }))
      setIsPreview(true)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  }))

  const updateReview = useMutation(trpc.reviews.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
        productId,
      }))
      setIsPreview(true)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  }))


  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? 'Your rating' : 'Liked it? Give it a rating'}
        </p>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a review"
                  disabled={isPreview}
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button 
            variant='elevated'
            disabled={createReview.isPending || updateReview.isPending}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {review ? 'Update review' : 'Submit review'}
          </Button>
        )}
      </form>

      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size="lg"
          type="button"
          variant="elevated"
          className="w-fit mt-4"
        >
          Edit review
        </Button>
      )}
    </Form>
  )
}
