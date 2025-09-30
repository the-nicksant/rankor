import { Button } from '@repo/ui/button'
import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router'


export const ThirdStep = ({ id }: { id?: string }) => {

  return (
    <div>
      <CheckCircle size={100} className='text-rankor mb-6'/>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Acesse seu email</h2>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Tudo certo por aqui. Crie sua senha clicando no botão abaixo.
      </p>

      <div className='flex items-center w-full flex-1'>
        {
          id && 
          <Link to={`/app/confirm-account/${id}`} className='w-full'>
            <Button className='w-full mt-6 flex-1'>
              Criar senha
            </Button>
          </Link>
        }

        <Link to='/app/login' className='w-full'>
          <Button className='w-full mt-6 ' variant='secondary'>
            Voltar para login
          </Button>
        </Link>
      </div>

    </div>
  )
}
