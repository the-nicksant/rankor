import { ArrowLeftRight, ChevronDown, ExternalLink, X } from 'lucide-react'
import { useReducer, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import Select from '@repo/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@repo/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { experienceOptions } from '~/features/athlete/domain/experience'
import { useEvent } from '~/features/event/hooks/data'
import { cn } from '~/lib/cn'
import type { ModalProps } from '~/shared/types/modal'
import { AthleteSelection } from './athlete-selection'
import { useModalities } from '~/shared/hooks/data'

export type CreateFightPayload = {
  eventId: string
}

export default function CreateFight({ onClose, payload }: ModalProps<CreateFightPayload>) {

  const { data: event } = useEvent({ eventId: payload?.eventId })
  const { data: modalities } = useModalities()

  const [isExpandedInfo, setIsExpandedInfo] = useState(false)


  const [state, dispatch] = useReducer((state, action: { type: string, payload?: any }) => {
    switch(action.type){
      case 'set_fighter':
        return { ...state, fighters: { ...state.fighters, ...action.payload }}
      case 'select_fighter':
        if(!state.fighters.a) { 
          return {
            ...state,
            fighters: {
              ...state.fighters,
              a: action.payload
            }
          }
        }

        if(!state.fighters.b) { 
          return {
            ...state,
            fighters: {
              ...state.fighters,
              b: action.payload
            }
          }
        }
       
        return state
      case 'switch_fighters':
        return { ...state, fighters: { a: state.fighters.b, b: state.fighters.a }}
      case 'set_modality':
        return { ...state, modality: action.payload }
      case 'set_experience':
        return { ...state, experience: action.payload }
      case 'set_weightclass':
        return { ...state, weightclass: action.payload }
      default:
        return state
    }
  },
  {
    modality: undefined,
    weightclass: undefined,
    experience: null,
    fighters: {
      a: null,
      b: null
    },
  })

  const availableModalitiesKeys = Object.keys(event?.modalitiesConfig || {})
  const availableWeightClasses = event
    ?.modalitiesConfig[state.modality as string]
    ?.weightclasses
      .map(weightclass => ({
        label: weightclass.title,
        value: [weightclass.minWeight, weightclass.maxWeight].toString()
      })) 
  || []

  const availableExperiences = event
    ?.modalitiesConfig[state.modality as string]
    ?.experience
  || []

  const additionalInfo = [
    {
      key: 'city',
      label: 'Cidade'
    },
    {
      key: 'height',
      label: 'Altura'
    },
    {
      key: 'weight',
      label: 'Peso'
    },
    {
      key: 'reach',
      label: 'Alcance'
    },
  ]


  return (
    <Sheet 
      open 
      onOpenChange={() => onClose()}
    >
      <SheetContent className='w-full max-w-[600px]'>
        <SheetHeader>
          <SheetTitle>Criar luta</SheetTitle>
          <SheetDescription>Selecione os atletas, modalidade, categoria e configure a luta como desejar</SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          <div className='flex items-center gap-2 px-4 py-2'>
            <Select 
              value={state.modality}
              onChange={(v) => dispatch({ type: 'set_modality', payload: v})}
              options={modalities
                ?.filter(m => availableModalitiesKeys.includes(m.code))
                ?.map(m => ({ value: m.code, label: m.name }))}
              placeholder='Modalidade'
            />
            <Select 
              value={state.weightclass}
              onChange={(v) => dispatch({ type: 'set_weightclass', payload: v })}
              options={availableWeightClasses}
              placeholder='Categoria de peso'
            />
          </div>
          <div className='flex-1 flex items-center gap-2 px-4'>
            {
              experienceOptions
                .filter(exp => availableExperiences.includes(exp.value))
                .map(exp => (
                  <Badge 
                    className='cursor-pointer'
                    title={exp.label}
                    fill={state.experience === exp.value}
                    onClick={() => dispatch({ type: 'set_experience', payload: exp.value })}
                  >
                    {exp.label}
                  </Badge>
              ))
            }
          </div>
          <div className='w-full border-b border-border mt-4'>
            <div className='flex justify-center relative w-full'>
              <AthleteProfile 
                athlete={state.fighters.a} 
                corner='a'
                onRemove={() => dispatch({ type: 'set_fighter', payload: { a: null }})}
              />
              <AthleteProfile 
                athlete={state.fighters.b} 
                corner='b'
                onRemove={() => dispatch({ type: 'set_fighter', payload: { b: null }})}
              />
              <div className='absolute self-center flex flex-col gap-1 items-center text-rankor top-[50%] -translate-y-[50%]'>
                <span>VS</span>

                <Button
                  hidden={!state.fighters.a && !state.fighters.b}
                  size={'sm'} 
                  variant='text' 
                  onClick={() => dispatch({ type: 'switch_fighters' })}
                >
                  <ArrowLeftRight />
                </Button>
              </div>
            </div>
            <button 
              className='w-full flex items-center justify-center py-1 cursor-pointer hover:bg-accent transition-all' 
              onClick={() => setIsExpandedInfo(s => !s)}
            >
              <ChevronDown size={16} className={isExpandedInfo ? 'rotate-180': 'rotate-0 transition-all'}/>
            </button>
            {
              isExpandedInfo && (
                <ul className='flex flex-col w-full py-4 items-center '>
                  <span className='mb-6 text-xs'>informações</span>
                  {
                    additionalInfo.map(info => (
                      <li 
                        key={info.key}
                        className='w-full gap-4 border-b border-border last:border-b-0 py-1'
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 30% 1fr',
                          columnGap: 16
                        }}
                      >
                        <p className='text-xs text-end'>
                          {state.fighters.a?.[info.key]}
                        </p>
                        <span className='text-sm uppercase text-center'>
                          {info.label}
                        </span>
                        <p className='text-xs text-start'>
                          {state.fighters.b?.[info.key]}
                        </p>
                      </li>
                    ))
                  }
                </ul>
              )
            }
          </div>

          <Tabs defaultValue='athletes' className='mt-6'>
            <TabsList>
              <TabsTrigger value='athletes'>
                Atletas inscritos
              </TabsTrigger>
            </TabsList>
            <TabsContent value='athletes'>
              <AthleteSelection 
                fightConfig={{
                  modality: state.modality,
                  experience: state.experience,
                  weightclass: state.weightclass
                }}
                selectedAthletes={state.fighters}
                onSelectAthlete={(athlete) => 
                  dispatch({ type: 'select_fighter', payload: athlete})
                }
              />
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          <Button size={'lg'}>
            Criar luta
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type AthleteProfileProps = { 
  athlete?: any, 
  corner: 'a' | 'b',
  onRemove: () => void
}

const AthleteProfile = ({ athlete, corner, onRemove }: AthleteProfileProps) => {
  return (
    <div 
      className={cn(
        'w-full flex-1 py-4 relative', 
        corner === 'a' 
          ? 'pr-8 bg-corner-a'
          : 'pl-8 bg-corner-b',
        !athlete && 'bg-background'
      )}
    >
      {
        athlete &&
          <div
            className={cn(
              'flex flex-col gap-2 absolute top-2',
              corner === 'a'
                ? 'left-2'
                : 'right-2'
            )}
          >
            <Button variant='text' size={'sm'} onClick={onRemove}>
              <X />
            </Button>
            <Button variant='text' size={'sm'}>
              <ExternalLink />
            </Button>
          </div>
      }
      <div 
        className={cn(
          'flex', 
          corner === 'a' 
            ? 'text-end justify-end'
            : 'text-start justify-start'
        )}
      >
        <Avatar className='size-24'>
          <AvatarImage src={athlete?.avatar}/>
          <AvatarFallback>
            ?
          </AvatarFallback>
        </Avatar>
      </div>

      <div 
        className={cn(
          'flex flex-col gap-2 mt-4', 
          corner === 'a' 
            ? 'text-end justify-end pl-2'
            : 'text-start justify-start pr-2'
        )}
      >
        <h1 className='text-title text-xl'>{athlete?.firstname || 'Selecione um atleta'} {athlete?.lastname}</h1>
        <p className='text-label'>{athlete?.wins} / {athlete?.losses}</p>
      </div>
    </div>
  )
}