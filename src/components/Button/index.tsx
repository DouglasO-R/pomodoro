import { ButtonContainer } from './Button.styles'

type Props = {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
}

export function Button({ variant = 'primary' }: Props) {
  return <ButtonContainer variant={variant}> Enviar</ButtonContainer>
}
