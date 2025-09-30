import { useQueryClient } from "@tanstack/react-query"
import React, { useState, useContext } from "react"
import { useParams } from "react-router"
import type { Event } from "~/features/event/models/event"

import { parseAsInteger, useQueryState } from 'nuqs'
import { useEvent } from "~/features/event/hooks/data"

const EventCreationContext = React.createContext({
  currentStep: 0,
  setCurrentStep: (step: number) => {},
  nextStep: () => {},
  previousStep: () => {},
  formData: {} as any,
  setFormData: (_: any) => {},
  currentEvent: {} as Event | undefined,
  updateCurrentEventData: (data: Partial<Event>) => {},
  loadingCurrentEvent: false
}) 

export const EventCreationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams()
  const queryClient = useQueryClient()

  const { data: currentEvent, isLoading } = useEvent({ eventId: eventId })

  const [currentStep, setCurrentStep] = useQueryState('step', parseAsInteger.withDefault(0))
  const [formData, setFormData] = useState<any>({})

  const nextStep = () => setCurrentStep((step) => step + 1)
  const previousStep = () => setCurrentStep((step) => Math.max(0, step - 1))

  const updateCurrentEventData = (data: Partial<Event>) => {
    queryClient.setQueryData(['fetch-event-by-id', eventId], { ...currentEvent, ...data})
  }

  return (
    <EventCreationContext.Provider value={{
      currentStep,
      nextStep,
      previousStep,
      setCurrentStep,
      formData,
      setFormData,
      currentEvent,
      updateCurrentEventData,
      loadingCurrentEvent: isLoading
    }}>
      {children}
    </EventCreationContext.Provider>
  )
}

export const useEventCreation = () => useContext(EventCreationContext)